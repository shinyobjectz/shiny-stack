import { useState } from "react"
import { useAction } from "convex/react"
import { api } from "@/convex"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { Database, Play, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "../../lib/utils"
import { stylesConfig } from "../../lib/config"

export function DataCanvas() {
  const [query, setQuery] = useState("")
  const [database, setDatabase] = useState("sample")
  const [isExecuting, setIsExecuting] = useState(false)
  const [results, setResults] = useState<any>(null)
  
  const analyzeData = useAction(api.actions.analyze.data)

  const handleExecuteQuery = async () => {
    if (!query.trim()) {
      toast.error("Please enter a SQL query")
      return
    }

    setIsExecuting(true)
    try {
      const result = await analyzeData({ query, database })
      setResults(result)
      toast.success("Query executed successfully!")
    } catch (error) {
      toast.error("Query failed: " + (error instanceof Error ? error.message : 'Unknown error'))
      setResults(null)
    } finally {
      setIsExecuting(false)
    }
  }

  const sampleQueries = [
    "SELECT * FROM users LIMIT 10",
    "SELECT COUNT(*) FROM orders WHERE status = 'completed'",
    "SELECT category, AVG(price) FROM products GROUP BY category",
    "SELECT * FROM sales WHERE date >= '2024-01-01'",
  ]

  return (
    <div className="h-full p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className={cn("text-3xl font-bold mb-2", stylesConfig.text.primary)}>Data Analytics</h2>
          <p className={cn("text-lg", stylesConfig.text.secondary)}>Query and analyze data with SQL sandbox</p>
        </div>

        {/* Query Interface */}
        <div className={cn(
          "rounded-2xl p-8 mb-8 border",
          stylesConfig.chat.panel.background,
          stylesConfig.borders.default
        )}>
          <div className="mb-6">
            <label className={cn("block text-sm font-medium mb-3", stylesConfig.text.primary)}>
              Database
            </label>
            <select
              value={database}
              onChange={(e) => setDatabase(e.target.value)}
              className={cn(
                "px-4 py-3 border rounded-2xl w-48",
                stylesConfig.chat.input.background,
                stylesConfig.chat.input.border,
                stylesConfig.chat.input.focus,
                stylesConfig.text.primary
              )}
            >
              <option value="sample">Sample Database</option>
              <option value="ecommerce">E-commerce Demo</option>
              <option value="analytics">Analytics Data</option>
            </select>
          </div>

          <div className="mb-6">
            <label className={cn("block text-sm font-medium mb-3", stylesConfig.text.primary)}>
              SQL Query
            </label>
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your SQL query..."
              className={cn(
                "font-mono text-sm min-h-[120px] rounded-2xl border",
                stylesConfig.chat.input.background,
                stylesConfig.chat.input.border,
                stylesConfig.chat.input.focus
              )}
            />
          </div>

          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => void handleExecuteQuery()}
              disabled={isExecuting || !query.trim()}
              className={cn("rounded-2xl", stylesConfig.components.button.primary)}
            >
              {isExecuting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Executing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Execute Query
                </>
              )}
            </Button>
            
            <div className={cn("text-sm", stylesConfig.text.secondary)}>
              Sandboxed environment • Read-only queries
            </div>
          </div>

          {/* Sample Queries */}
          <div>
            <div className={cn("text-sm font-medium mb-3", stylesConfig.text.primary)}>Sample Queries:</div>
            <div className="flex flex-wrap gap-2">
              {sampleQueries.map((sampleQuery, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setQuery(sampleQuery)}
                  className={cn(
                    "font-mono text-xs rounded-full border",
                    stylesConfig.chat.suggestions.background,
                    stylesConfig.chat.suggestions.border,
                    stylesConfig.chat.suggestions.hover
                  )}
                >
                  {sampleQuery}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className={cn(
            "rounded-2xl p-6 border",
            stylesConfig.chat.panel.background,
            stylesConfig.borders.default
          )}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={cn("text-xl font-semibold", stylesConfig.text.primary)}>Query Results</h3>
              <div className={cn("text-sm", stylesConfig.text.secondary)}>
                {results.rowCount} rows • {results.executionTime}ms
              </div>
            </div>

            {results.rows.length > 0 ? (
              <div className="overflow-x-auto">
                <table className={cn("min-w-full divide-y", stylesConfig.borders.default)}>
                  <thead className={stylesConfig.chat.input.background}>
                    <tr>
                      {results.columns.map((column: string, index: number) => (
                        <th
                          key={index}
                          className={cn(
                            "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider",
                            stylesConfig.text.secondary
                          )}
                        >
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className={cn("divide-y", stylesConfig.borders.default)}>
                    {results.rows.map((row: any[], rowIndex: number) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className={cn("px-6 py-4 whitespace-nowrap text-sm", stylesConfig.text.primary)}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={cn("text-center py-8", stylesConfig.text.secondary)}>
                <Database className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No results found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
