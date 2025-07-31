import React, { useEffect, useRef, useState } from 'react';
import { liquidFragSource } from '../hero/liquid-frag';
import { defaultParams } from '../hero/params';
import type { ShaderParams } from '../hero/params';
import { parseLogoImage } from '../hero/parse-logo-image';

interface LiquidMetalObjectProps {
  imageSrc: string;
  width?: number;
  height?: number;
  params?: Partial<ShaderParams>;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function LiquidMetalObject({
  imageSrc,
  width = 400,
  height = 400,
  params = {},
  className = '',
  style = {},
  onClick
}: LiquidMetalObjectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const uniformsRef = useRef<Record<string, WebGLUniformLocation>>({});
  const programRef = useRef<WebGLProgram | null>(null);
  const imageDataRef = useRef<ImageData | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const shaderParamsRef = useRef<ShaderParams>({ ...defaultParams, ...params });
  const startTimeRef = useRef<number>(Date.now());
  const animationIdRef = useRef<number | undefined>(undefined);

  // Initialize WebGL shaders
  const initShaders = (gl: WebGL2RenderingContext): void => {
    const vertexShaderSource = `#version 300 es
precision mediump float;

in vec2 a_position;
out vec2 vUv;

void main() {
    vUv = .5 * (a_position + 1.);
    gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    const createShader = (type: number, source: string): WebGLShader => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        throw new Error('Shader compilation failed');
      }
      return shader;
    };

    const createProgram = (vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram => {
      const program = gl.createProgram()!;
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program linking error:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        throw new Error('Program linking failed');
      }
      return program;
    };

    const getUniforms = (program: WebGLProgram): Record<string, WebGLUniformLocation> => {
      let uniforms: Record<string, WebGLUniformLocation> = {};
      let uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < uniformCount; i++) {
        let uniformName = gl.getActiveUniform(program, i)?.name;
        if (!uniformName) continue;
        uniforms[uniformName] = gl.getUniformLocation(program, uniformName) as WebGLUniformLocation;
      }
      return uniforms;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, liquidFragSource);
    const program = createProgram(vertexShader, fragmentShader);
    
    gl.useProgram(program);
    const uniforms = getUniforms(program);

    // Setup geometry
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    programRef.current = program;
    uniformsRef.current = uniforms;
  };

  // Load and process image
  const loadImage = async () => {
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const file = new File([blob], 'image.png', { type: 'image/png' });
      
      const { imageData } = await parseLogoImage(file);
      imageDataRef.current = imageData;
      setIsLoaded(true);
    } catch (error) {
      console.error('Failed to load image:', error);
      createFallbackTexture();
    }
  };

  const createFallbackTexture = () => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, size, size);
    
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const radius = Math.random() * 10 + 5;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const imageData = ctx.getImageData(0, 0, size, size);
    imageDataRef.current = imageData;
    setIsLoaded(true);
  };

  // Upload texture to GPU
  const uploadTexture = (imageData: ImageData) => {
    const gl = glRef.current;
    const uniforms = uniformsRef.current;
    if (!gl || !uniforms.u_image_texture) return;

    const existingTexture = gl.getParameter(gl.TEXTURE_BINDING_2D);
    if (existingTexture) {
      gl.deleteTexture(existingTexture);
    }

    const imageTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, imageTexture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

    try {
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        imageData.width,
        imageData.height,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        imageData.data
      );
      gl.uniform1i(uniforms.u_image_texture, 0);
    } catch (e) {
      console.error('Error uploading texture:', e);
    }
  };

  // Update shader uniforms
  const updateUniforms = () => {
    const gl = glRef.current;
    const uniforms = uniformsRef.current;
    if (!gl || !uniforms) return;
    
    gl.uniform1f(uniforms.u_edge, shaderParamsRef.current.edge);
    gl.uniform1f(uniforms.u_patternBlur, shaderParamsRef.current.patternBlur);
    gl.uniform1f(uniforms.u_patternScale, shaderParamsRef.current.patternScale);
    gl.uniform1f(uniforms.u_refraction, shaderParamsRef.current.refraction);
    gl.uniform1f(uniforms.u_liquid, shaderParamsRef.current.liquid);
  };

  // Render loop
  const render = () => {
    const gl = glRef.current;
    const uniforms = uniformsRef.current;
    if (!gl || !uniforms) return;

    const time = Date.now() - startTimeRef.current;
    
    if (uniforms.u_time) {
      gl.uniform1f(uniforms.u_time, time * shaderParamsRef.current.speed);
    }

    updateUniforms();

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    animationIdRef.current = requestAnimationFrame(render);
  };

  // Calculate proper aspect ratio scaling
  const calculateAspectRatio = () => {
    const imageData = imageDataRef.current;
    if (!imageData) return { width, height, ratio: 1 };
    
    const imageRatio = imageData.width / imageData.height;
    const containerRatio = width / height;
    
    let finalWidth = width;
    let finalHeight = height;
    let ratio = 1;
    
    if (imageRatio > containerRatio) {
      // Image is wider than container - fit to height
      finalWidth = height * imageRatio;
      ratio = height / imageData.height;
    } else {
      // Image is taller than container - fit to width
      finalHeight = width / imageRatio;
      ratio = width / imageData.width;
    }
    
    return { width: finalWidth, height: finalHeight, ratio };
  };

  // Initialize WebGL
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', {
      antialias: true,
      alpha: true,
    });
    
    if (!gl) {
      console.error('WebGL2 not supported');
      return;
    }

    glRef.current = gl;
    initShaders(gl);
    loadImage();
  }, [imageSrc]);

  // Handle image loading and texture upload
  useEffect(() => {
    if (isLoaded && imageDataRef.current && glRef.current && uniformsRef.current.u_image_texture) {
      uploadTexture(imageDataRef.current);
      
      // Update image ratio uniform
      if (uniformsRef.current.u_img_ratio) {
        const imgRatio = imageDataRef.current.width / imageDataRef.current.height;
        glRef.current.uniform1f(uniformsRef.current.u_img_ratio, imgRatio);
      }
      
      // Start render loop after texture is uploaded
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      render();
    }
  }, [isLoaded]);

  // Handle parameter updates
  useEffect(() => {
    shaderParamsRef.current = { ...defaultParams, ...params };
  }, [params]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (!glRef.current || !uniformsRef.current) return;
      
      const { ratio } = calculateAspectRatio();
      
      // Update ratio uniform
      if (uniformsRef.current.u_ratio) {
        glRef.current.uniform1f(uniformsRef.current.u_ratio, ratio);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width, height]);

  const { width: finalWidth, height: finalHeight } = calculateAspectRatio();

  return (
    <canvas
      ref={canvasRef}
      width={finalWidth * window.devicePixelRatio}
      height={finalHeight * window.devicePixelRatio}
      style={{
        width: finalWidth,
        height: finalHeight,
        display: 'block',
        ...style
      }}
      className={className}
      onClick={onClick}
    />
  );
}
