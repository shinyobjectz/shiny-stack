// TOML Form Editor JavaScript
(function() {
    'use strict';

    // Get VSCode API
    const vscode = window.vscode || acquireVsCodeApi();
    
    // Form data management
    let formData = window.initialData || {};
    let isModified = false;

    // Initialize the form when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initializeForm();
        setupEventListeners();
    });

    function initializeForm() {
        console.log('Initializing TOML form with data:', formData);
        
        // Set up section toggles
        setupSectionToggles();
        
        // Set up object field toggles
        setupObjectToggles();
        
        // Set up array field handlers
        setupArrayHandlers();
        
        // Set up slider value displays
        setupSliders();
        
        // Set up password field toggles
        setupPasswordFields();
        
        // Set up form change tracking
        setupChangeTracking();
    }

    function setupEventListeners() {
        // Save button
        const saveBtn = document.getElementById('save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', saveForm);
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                saveForm();
            }
            if (e.key === 'Escape') {
                // Close expanded sections or focus save button
                const saveBtn = document.getElementById('save-btn');
                if (saveBtn) saveBtn.focus();
            }
        });
    }

    function setupSectionToggles() {
        const sectionHeaders = document.querySelectorAll('.section-header');
        
        sectionHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const section = header.dataset.section || 
                               header.parentElement.dataset.section;
                toggleSection(section);
            });
            
            const toggle = header.querySelector('.section-toggle');
            if (toggle) {
                toggle.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const section = toggle.dataset.section || 
                                   toggle.closest('.form-section').dataset.section;
                    toggleSection(section);
                });
            }
        });
    }

    function toggleSection(sectionId) {
        const content = document.getElementById(`section-${sectionId}`);
        const toggle = document.querySelector(`[data-section="${sectionId}"] .section-toggle`);
        
        if (content && toggle) {
            const isCollapsed = content.classList.contains('collapsed');
            
            if (isCollapsed) {
                content.classList.remove('collapsed');
                toggle.textContent = '−';
            } else {
                content.classList.add('collapsed');
                toggle.textContent = '+';
            }
        }
    }

    function setupObjectToggles() {
        const objectHeaders = document.querySelectorAll('.object-header');
        
        objectHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const toggle = header.querySelector('.object-toggle');
                const targetId = toggle?.dataset.target;
                
                if (targetId) {
                    const content = document.getElementById(`object-${targetId}`);
                    if (content) {
                        const isCollapsed = content.classList.contains('collapsed');
                        
                        if (isCollapsed) {
                            content.classList.remove('collapsed');
                            toggle.textContent = '−';
                        } else {
                            content.classList.add('collapsed');
                            toggle.textContent = '+';
                        }
                    }
                }
            });
        });
    }

    function setupArrayHandlers() {
        // Add item buttons
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('array-add')) {
                const arrayId = e.target.dataset.array;
                addArrayItem(arrayId);
            }
            
            if (e.target.classList.contains('array-remove')) {
                const arrayId = e.target.dataset.array;
                const index = parseInt(e.target.dataset.index);
                removeArrayItem(arrayId, index);
            }
        });
    }

    function addArrayItem(arrayId) {
        const container = document.querySelector(`[data-field="${arrayId}"] .array-container`);
        const items = container.querySelectorAll('.array-item');
        const newIndex = items.length;
        const newItemId = `${arrayId}.${newIndex}`;

        const itemHtml = `
            <div class="array-item" data-index="${newIndex}">
                <input 
                    type="text" 
                    id="${newItemId}" 
                    name="${newItemId}"
                    class="form-input array-input" 
                    value=""
                    data-type="array-item"
                    placeholder="Enter value"
                />
                <button type="button" class="array-remove" data-array="${arrayId}" data-index="${newIndex}">×</button>
            </div>
        `;

        const addButton = container.querySelector('.array-add');
        addButton.insertAdjacentHTML('beforebegin', itemHtml);
        
        // Focus the new input
        const newInput = document.getElementById(newItemId);
        if (newInput) {
            newInput.focus();
            setupInputTracking(newInput);
        }
        
        markAsModified();
    }

    function removeArrayItem(arrayId, index) {
        const item = document.querySelector(`[data-array="${arrayId}"][data-index="${index}"]`).closest('.array-item');
        if (item) {
            item.remove();
            // Re-index remaining items
            reindexArrayItems(arrayId);
            markAsModified();
        }
    }

    function reindexArrayItems(arrayId) {
        const container = document.querySelector(`[data-field="${arrayId}"] .array-container`);
        const items = container.querySelectorAll('.array-item');
        
        items.forEach((item, index) => {
            item.dataset.index = index;
            const input = item.querySelector('.array-input');
            const removeBtn = item.querySelector('.array-remove');
            
            if (input) {
                const newId = `${arrayId}.${index}`;
                input.id = newId;
                input.name = newId;
            }
            
            if (removeBtn) {
                removeBtn.dataset.index = index;
            }
        });
    }

    function setupSliders() {
        const sliders = document.querySelectorAll('.form-slider');
        
        sliders.forEach(slider => {
            const valueDisplay = document.getElementById(`${slider.id}-value`);
            
            slider.addEventListener('input', function() {
                if (valueDisplay) {
                    valueDisplay.textContent = this.value;
                }
                markAsModified();
            });
        });
    }

    function setupPasswordFields() {
        const passwordToggles = document.querySelectorAll('.password-toggle');
        
        passwordToggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                const targetId = this.dataset.target;
                const input = document.getElementById(targetId);
                
                if (input) {
                    const isPassword = input.type === 'password';
                    input.type = isPassword ? 'text' : 'password';
                    this.textContent = isPassword ? '🙈' : '👁️';
                }
            });
        });
    }

    function setupChangeTracking() {
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            setupInputTracking(input);
        });
    }

    function setupInputTracking(input) {
        input.addEventListener('input', markAsModified);
        input.addEventListener('change', markAsModified);
    }

    function markAsModified() {
        if (!isModified) {
            isModified = true;
            updateSaveButton();
        }
    }

    function updateSaveButton() {
        const saveBtn = document.getElementById('save-btn');
        if (saveBtn) {
            if (isModified) {
                saveBtn.textContent = '💾 Save*';
                saveBtn.classList.add('modified');
            } else {
                saveBtn.textContent = '💾 Save';
                saveBtn.classList.remove('modified');
            }
        }
    }

    function collectFormData() {
        const data = {};
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            if (input.name && input.name.includes('.')) {
                const path = input.name.split('.');
                const dataType = input.dataset.type;
                let value = input.value;
                
                // Convert data types
                if (dataType === 'number') {
                    value = input.type === 'range' ? parseFloat(value) : 
                           (input.value.includes('.') ? parseFloat(value) : parseInt(value));
                } else if (dataType === 'boolean') {
                    value = input.checked;
                } else if (dataType === 'array-item') {
                    // Arrays are handled separately
                    return;
                }
                
                setNestedValue(data, path, value);
            }
        });
        
        // Handle arrays separately
        const arrayContainers = document.querySelectorAll('.array-container');
        arrayContainers.forEach(container => {
            const fieldId = container.dataset.field;
            if (fieldId) {
                const path = fieldId.split('.');
                const arrayInputs = container.querySelectorAll('.array-input');
                const arrayValues = Array.from(arrayInputs).map(input => {
                    const value = input.value.trim();
                    // Try to parse as number if it looks like one
                    if (/^\d+(\.\d+)?$/.test(value)) {
                        return value.includes('.') ? parseFloat(value) : parseInt(value);
                    }
                    return value;
                }).filter(value => value !== '');
                
                setNestedValue(data, path, arrayValues);
            }
        });
        
        return data;
    }

    function setNestedValue(obj, path, value) {
        let current = obj;
        
        for (let i = 0; i < path.length - 1; i++) {
            const key = path[i];
            if (!(key in current)) {
                current[key] = {};
            }
            current = current[key];
        }
        
        const lastKey = path[path.length - 1];
        current[lastKey] = value;
    }

    function saveForm() {
        const saveBtn = document.getElementById('save-btn');
        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.textContent = '💾 Saving...';
        }
        
        try {
            const formData = collectFormData();
            console.log('Saving form data:', formData);
            
            vscode.postMessage({
                command: 'save',
                data: formData
            });
            
            isModified = false;
            updateSaveButton();
            
            // Show success feedback
            showNotification('Configuration saved successfully!', 'success');
            
        } catch (error) {
            console.error('Error saving form:', error);
            showNotification('Error saving configuration', 'error');
        } finally {
            if (saveBtn) {
                saveBtn.disabled = false;
                updateSaveButton();
            }
        }
    }

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: 'var(--radius)',
            backgroundColor: type === 'success' ? 'hsl(var(--primary))' : 
                           type === 'error' ? 'hsl(var(--destructive))' : 
                           'hsl(var(--secondary))',
            color: type === 'success' ? 'hsl(var(--primary-foreground))' :
                   type === 'error' ? 'hsl(var(--destructive-foreground))' :
                   'hsl(var(--secondary-foreground))',
            fontSize: '0.875rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            zIndex: '1000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Handle messages from VS Code
    window.addEventListener('message', event => {
        const message = event.data;
        
        switch (message.command) {
            case 'refresh':
                // Reload the form data
                location.reload();
                break;
                
            case 'saved':
                showNotification('Configuration saved successfully!', 'success');
                break;
                
            case 'error':
                showNotification(message.text || 'An error occurred', 'error');
                break;
        }
    });

    // Warn about unsaved changes
    window.addEventListener('beforeunload', function(e) {
        if (isModified) {
            e.preventDefault();
            e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
            return e.returnValue;
        }
    });

    // Auto-save functionality (optional)
    let autoSaveTimeout;
    function scheduleAutoSave() {
        if (autoSaveTimeout) {
            clearTimeout(autoSaveTimeout);
        }
        
        autoSaveTimeout = setTimeout(() => {
            if (isModified) {
                console.log('Auto-saving form...');
                saveForm();
            }
        }, 5000); // Auto-save after 5 seconds of inactivity
    }

    // Enable auto-save if desired
    document.addEventListener('input', scheduleAutoSave);

    // Form validation
    function validateForm() {
        const requiredFields = document.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });
        
        // Validate URLs
        const urlFields = document.querySelectorAll('input[type="url"]');
        urlFields.forEach(field => {
            if (field.value && !isValidUrl(field.value)) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });
        
        // Validate emails
        const emailFields = document.querySelectorAll('input[type="email"]');
        emailFields.forEach(field => {
            if (field.value && !isValidEmail(field.value)) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });
        
        return isValid;
    }

    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Add validation styles to CSS
    const style = document.createElement('style');
    style.textContent = `
        .form-input.error,
        .form-textarea.error,
        .form-select.error {
            border-color: hsl(var(--destructive));
            box-shadow: 0 0 0 2px hsl(var(--destructive) / 0.2);
        }
        
        .save-button.modified {
            background-color: hsl(var(--ring));
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
        }
    `;
    document.head.appendChild(style);

    // Export functions for debugging
    window.TomlFormEditor = {
        collectFormData,
        saveForm,
        validateForm,
        markAsModified
    };

})();