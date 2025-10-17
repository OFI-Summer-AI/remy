import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { 
  Send, Loader2, AlertCircle, CheckCircle, XCircle, 
  TrendingUp, Minus, Star, User, Package,
  Target, MessageSquare, Sparkles
} from "lucide-react";
import { Textarea } from "@/shared/components/ui/textarea";

// ✅ Custom hook to send reviews to real API
const useReviewAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any[] | null>(null);

  const analyzeReview = async (reviewData: { review: string; rate: number }) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(
        "https://n8n.sofiatechnology.ai/webhook/b1936b49-f120-442b-8d09-dbb86043d8a3",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reviewData),
        }
      );

      if (!response.ok) {
        throw new Error("Error al analizar la review");
      }

      const result = await response.json();

      // ✅ Expecting the API to return an array of objects like:
      // [
      //   { category, confidence, pain_points, sentiment_label, subject }
      // ]
      setData(result);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return { analyzeReview, loading, error, data, reset };
};

// Sentiment Badge Component
const SentimentBadge = ({ sentiment }: { sentiment: string }) => {
  const config: any = {
    Good: {
      icon: CheckCircle,
      className: "bg-green-100 text-green-800 border-green-300",
      iconColor: "text-green-600",
    },
    Bad: {
      icon: XCircle,
      className: "bg-red-100 text-red-800 border-red-300",
      iconColor: "text-red-600",
    },
    Neutral: {
      icon: Minus,
      className: "bg-yellow-100 text-yellow-800 border-yellow-300",
      iconColor: "text-yellow-600",
    },
  };

  const { icon: Icon, className, iconColor } = config[sentiment] || config.Neutral;

  return (
    <Badge className={`${className} border flex items-center gap-1`}>
      <Icon className={`w-3 h-3 ${iconColor}`} />
      {sentiment}
    </Badge>
  );
};

// Subject Info Component
const SubjectInfo = ({ subject }: { subject: any }) => {
  if (!subject) return null;

  const Icon = subject.type === "employee" ? User : Package;
  const bgColor = subject.type === "employee" ? "bg-purple-50" : "bg-blue-50";
  const textColor = subject.type === "employee" ? "text-purple-700" : "text-blue-700";

  return (
    <div className={`${bgColor} rounded-lg p-2 flex items-center gap-2`}>
      <Icon className={`w-4 h-4 ${textColor}`} />
      <div>
        <p className={`text-xs font-medium ${textColor}`}>{subject.name}</p>
        <p className="text-xs text-muted-foreground capitalize">{subject.type}</p>
      </div>
    </div>
  );
};

const ReviewAnalyzer = () => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(4.5);
  const { analyzeReview, loading, error, data, reset } = useReviewAnalysis();

  const handleSubmit = () => {
    if (reviewText.trim()) {
      analyzeReview({
        review: reviewText,
        rate: parseFloat(rating),
      });
    }
  };

  const handleNewAnalysis = () => {
    reset();
    setReviewText("");
    setRating(4.5);
  };

  return (
    <section aria-label="Review Analysis Dashboard" className="space-y-6 max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Review Analyzer</h1>
          <p className="text-muted-foreground">AI-powered sentiment and category analysis</p>
        </div>
      </div>

      {/* Form Section */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Submit Review for Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Review Text</label>
              <Textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Enter customer review here..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={5}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.1"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="flex-grow"
                  disabled={loading}
                />
                <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-lg min-w-[100px]">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-bold text-lg">{rating}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={loading || !reviewText.trim()}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Analyze Review
                  </>
                )}
              </button>

              {(data || error) && (
                <button
                  onClick={handleNewAnalysis}
                  className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 rounded-lg font-medium transition-colors"
                >
                  New Analysis
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading */}
      {loading && (
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
              <p className="text-lg font-medium text-purple-900">Analyzing review...</p>
              <p className="text-sm text-muted-foreground mt-2">
                AI is processing sentiment and categories
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <div>
                <p className="font-semibold text-red-900">Analysis Failed</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {data && data.length > 0 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-on-background flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Analysis Results
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Categories Found</p>
                      <p className="text-2xl font-bold mt-1">{data.length}</p>
                    </div>
                    <Target className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Confidence</p>
                      <p className="text-2xl font-bold mt-1">
                        {(data.reduce((acc, item) => acc + item.confidence, 0) / data.length * 100).toFixed(0)}%
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Overall Sentiment</p>
                      <p className="text-2xl font-bold mt-1">
                        {data.filter(d => d.sentiment_label === "Good").length > data.length / 2
                          ? "Positive"
                          : data.filter(d => d.sentiment_label === "Bad").length > data.length / 2
                          ? "Negative"
                          : "Mixed"}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 text-on-background">Detailed Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.map((item, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{item.category}</CardTitle>
                      <SentimentBadge sentiment={item.sentiment_label} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">Confidence</span>
                        <span className="text-sm font-semibold">
                          {(item.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            item.confidence > 0.7
                              ? "bg-green-500"
                              : item.confidence > 0.5
                              ? "bg-yellow-500"
                              : "bg-orange-500"
                          }`}
                          style={{ width: `${item.confidence * 100}%` }}
                        />
                      </div>
                    </div>

                    {item.pain_points && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <p className="text-xs font-medium text-orange-900 mb-1">Pain Points:</p>
                        <p className="text-sm text-orange-800">{item.pain_points}</p>
                      </div>
                    )}

                    {item.subject && <SubjectInfo subject={item.subject} />}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* No Data */}
      {data && data.length === 0 && (
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-700">No Categories Detected</p>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                The AI couldn't identify any specific categories in this review. Try submitting a more detailed review.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
};

export default ReviewAnalyzer;
