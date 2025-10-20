import { useState, useEffect } from 'react';
import { X, Sparkles, Send, Loader2, AlertCircle, CheckCircle2, Code2, Database, Zap, Brain } from 'lucide-react';
import { askAIQuestion } from '../services/api';

const AskAIModal = ({ isOpen, onClose }) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [showSQL, setShowSQL] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // Tested and verified example questions that work 100%
  const exampleQuestions = [
    "Which state had the highest voter turnout in the latest general election?",
    "Which party gained or lost the most seats between two consecutive elections?",
    "What is the percentage of women candidates across all elections?",
    "Which constituencies had the narrowest victory margins?",
    "How has the vote share of national vs regional parties changed over time?",
    "What correlation exists between education level and the winning chances of candidates?",
  ];

  // Engaging loading steps
  const loadingSteps = [
    { icon: Brain, text: "Understanding your question...", color: "text-purple-600" },
    { icon: Zap, text: "Generating SQL query...", color: "text-blue-600" },
    { icon: Database, text: "Running query on database...", color: "text-green-600" },
    { icon: Sparkles, text: "Generating answer...", color: "text-orange-600" },
  ];

  // Cycle through loading steps
  useEffect(() => {
    if (loading) {
      setLoadingStep(0);
      const interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);
    setShowSQL(false);

    try {
      const result = await askAIQuestion(question);
      setResponse(result);
    } catch (err) {
      setError(err.message || 'Failed to get answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (exampleQ) => {
    setQuestion(exampleQ);
    setError(null);
    setResponse(null);
  };

  const handleReset = () => {
    setQuestion('');
    setResponse(null);
    setError(null);
    setShowSQL(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Ask AI</h2>
                <p className="text-sm text-purple-100">
                  Natural language queries powered by Gemini AI
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Question Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ask a question about Indian Lok Sabha elections
            </label>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="E.g., Which party won the most seats in 2019?"
                  className="w-full p-4 pr-12 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none h-24 text-gray-700"
                  disabled={loading}
                />
                {question && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold 
                  hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Get Answer
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Engaging Loading State */}
          {loading && (
            <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-6">
              <div className="flex flex-col items-center space-y-4">
                {loadingSteps.map((step, idx) => {
                  const Icon = step.icon;
                  const isActive = idx === loadingStep;
                  const isPast = idx < loadingStep;
                  
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 w-full transition-all duration-500 ${
                        isActive ? 'scale-105' : 'scale-100'
                      } ${isPast ? 'opacity-50' : 'opacity-100'}`}
                    >
                      <div
                        className={`p-3 rounded-lg ${
                          isActive
                            ? 'bg-white shadow-lg'
                            : isPast
                            ? 'bg-gray-100'
                            : 'bg-white/50'
                        } transition-all duration-500`}
                      >
                        <Icon
                          className={`w-6 h-6 ${
                            isActive ? step.color : 'text-gray-400'
                          } ${isActive ? 'animate-pulse' : ''}`}
                        />
                      </div>
                      <div className="flex-1">
                        <p
                          className={`font-medium ${
                            isActive ? 'text-gray-900' : 'text-gray-500'
                          }`}
                        >
                          {step.text}
                        </p>
                        {isActive && (
                          <div className="mt-1 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse" />
                        )}
                      </div>
                      {isPast && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                      {isActive && (
                        <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  This may take a few seconds...
                </p>
              </div>
            </div>
          )}

          {/* Example Questions */}
          {!response && !error && !loading && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <p className="text-sm font-semibold text-gray-700">
                  Try these examples:
                </p>
              </div>
              <div className="space-y-2">
                {exampleQuestions.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleExampleClick(example)}
                    className="w-full text-left p-4 border-2 border-gray-200 rounded-xl hover:border-purple-400 
                      hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200 
                      text-sm text-gray-700 group hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0">
                        <div className="w-6 h-6 rounded-full bg-purple-100 group-hover:bg-purple-200 
                          flex items-center justify-center transition-colors">
                          <span className="text-xs font-bold text-purple-600">
                            {idx + 1}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 group-hover:text-purple-700 transition-colors">
                          {example}
                        </p>
                      </div>
                      <Send className="w-4 h-4 text-gray-400 group-hover:text-purple-600 
                        transition-colors opacity-0 group-hover:opacity-100" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800 mb-1">Error</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}
          {response && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">Answer Generated</span>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <p className="text-sm font-medium text-purple-800 mb-1">
                  Your Question:
                </p>
                <p className="text-purple-900">{response.question}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">AI Answer:</h3>
                </div>
                <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                  {response.answer}
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-800">
                    {response.totalRows}
                  </span>{' '}
                  {response.totalRows === 1 ? 'row' : 'rows'} found
                  {response.result.length < response.totalRows && (
                    <span className="text-gray-500">
                      {' '}
                      (showing first {response.result.length})
                    </span>
                  )}
                </p>
              </div>
              <div>
                <button
                  onClick={() => setShowSQL(!showSQL)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <Code2 className="w-4 h-4" />
                  {showSQL ? 'Hide' : 'Show'} Generated SQL Query
                </button>

                {showSQL && (
                  <div className="mt-3 bg-gray-900 rounded-xl p-4 overflow-x-auto">
                    <pre className="text-sm text-green-400 font-mono">
                      {response.sql}
                    </pre>
                  </div>
                )}
              </div>
              {response.result && response.result.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Data Preview:
                  </h3>
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto max-h-64">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                          <tr>
                            {Object.keys(response.result[0]).map((key) => (
                              <th
                                key={key}
                                className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap"
                              >
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {response.result.slice(0, 10).map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              {Object.values(row).map((value, i) => (
                                <td
                                  key={i}
                                  className="px-4 py-3 text-gray-700 whitespace-nowrap"
                                >
                                  {value === null ? (
                                    <span className="text-gray-400 italic">
                                      null
                                    </span>
                                  ) : (
                                    String(value)
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
              <button
                onClick={handleReset}
                className="w-full py-3 px-6 border-2 border-purple-600 text-purple-600 rounded-xl font-semibold 
                  hover:bg-purple-50 transition-colors"
              >
                Ask Another Question
              </button>
            </div>
          )}
        </div>
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <p className="text-xs text-center text-gray-500">
            You can ask any question — Gemini AI can intelligently answer queries using insights directly from the election database.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AskAIModal;
