import { useState } from "react"
import { useAction } from "convex/react"
import { api } from "@/convex"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { ScrollArea } from "./ui/scroll-area"
import { Database, Play, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function DataView() {
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
    <div className="h-full p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Data Analytics</h1>
          <p className="text-muted-foreground">Query and analyze data with SQL sandbox</p>
        </div>

        {/* Query Interface */}
        <div className="bg-card rounded-lg border p-6 mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Database
            </label>
            <select
              value={database}
              onChange={(e) => setDatabase(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="sample">Sample Database</option>
              <option value="ecommerce">E-commerce Demo</option>
              <option value="analytics">Analytics Data</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              SQL Query
            </label>
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your SQL query..."
              className="font-mono text-sm min-h-[120px]"
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={() => void handleExecuteQuery()}
              disabled={isExecuting || !query.trim()}
              className="gap-2"
            >
              {isExecuting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Execute Query
                </>
              )}
            </Button>
            
            <div className="text-sm text-muted-foreground">
              Sandboxed environment • Read-only queries
            </div>
          </div>

          {/* Sample Queries */}
          <div>
            <div className="text-sm font-medium mb-2">Sample Queries:</div>
            <div className="flex flex-wrap gap-2">
              {sampleQueries.map((sampleQuery, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setQuery(sampleQuery)}
                  className="font-mono text-xs"
                >
                  {sampleQuery}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Query Results</h2>
              <div className="text-sm text-muted-foreground">
                {results.rowCount} rows • {results.executionTime}ms
              </div>
            </div>

            {results.rows.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted">
                    <tr>
                      {results.columns.map((column: string, index: number) => (
                        <th
                          key={index}
                          className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                        >
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-background divide-y divide-border">
                    {results.rows.map((row: any[], rowIndex: number) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-6 py-4 whitespace-nowrap text-sm"
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
              <div className="text-center text-muted-foreground py-8">
                <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No results found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
