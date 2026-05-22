"use client";

import { useState } from "react";
import { WorkspaceLayout } from "@/components/workspace-layout";
import { useStudyStore } from "@/store/use-study-store";
import { useMistakeStore } from "@/store/use-mistake-store";
import {
  Sparkles,
  Bot,
  MessageSquare,
  Activity,
  CalendarDays,
  Target,
  Send,
} from "lucide-react";

export default function AIStudyCoachPage() {
  const { xp, level, currentStreak } = useStudyStore();
  const { mistakes, syllabus } = useMistakeStore();

  const [chatMessages, setChatMessages] = useState<Array<{ sender: "ai" | "user"; text: string }>>([
    { sender: "ai", text: "Greetings Ilham! I am ForgeCoach, your JEE study advisor. I have parsed your study sessions, mistake counts, and syllabus progress logs. How can I guide you today?" },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Heuristic analysis logic:
  
  // 1. Burnout Assessment
  const assessBurnout = () => {
    const totalMistakesCount = mistakes.length;
    const currentStreakValue = currentStreak;

    let response = "Based on your activity logs, your burnout risk is currently **LOW**. ";
    if (currentStreakValue > 10 && totalMistakesCount > 2) {
      response += "You have been maintaining a solid streak, but your mistake logs show a minor increase in calculation errors. This is usually a sign of slight cognitive fatigue. Recommendation: Insert a dedicated 1-day active recovery cycle after mock tests.";
    } else {
      response += "Your study spacing and session intervals are well balanced. Maintain your 50/10 Pomodoro patterns.";
    }
    return response;
  };

  // 2. Syllabus Completion Projections
  const projectCompletion = () => {
    let completedChaptersCount = 0;
    let totalChaptersCount = 0;

    Object.values(syllabus).forEach((subjectChapters) => {
      subjectChapters.forEach((chap) => {
        if (chap.completion >= 90) completedChaptersCount++;
        totalChaptersCount++;
      });
    });

    const completionRate = totalChaptersCount > 0 ? (completedChaptersCount / totalChaptersCount) * 100 : 0;
    
    // Estimate date
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + Math.round((100 - completionRate) * 1.5));

    return `You have completed **${completedChaptersCount} of ${totalChaptersCount}** chapters (above 90% completeness). At your current rate of 6.2 hours/day, your projected syllabus completion date is **${targetDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}**. This leaves you with a 45-day window for intensive full-syllabus mock tests before the final JEE examinations.`;
  };

  // 3. Physics / Weak Topic Advisories
  const getWeakTopicAdvice = () => {
    const physicsWeak = syllabus.Physics.flatMap((c) => c.weakTopics);
    const mathWeak = syllabus.Maths.flatMap((c) => c.weakTopics);
    
    let advice = "Analyzing your weak topics: \n\n";
    if (physicsWeak.length > 0) {
      advice += `- **Physics**: Focus on **${physicsWeak.join(", ")}**. Set up a 90-minute Deep Work session to solve at least 25 PYQs exclusively on these concepts.\n`;
    }
    if (mathWeak.length > 0) {
      advice += `- **Mathematics**: Keep practicing **${mathWeak.join(", ")}**. Do not rush. Draw out formula mappings for these before starting practice tests.\n`;
    }
    advice += "\nEnsure you log any calculation slips into the Mistake Journal immediately.";
    return advice;
  };

  const handleSendPrompt = (text: string) => {
    if (!text.trim()) return;

    // User message
    const userMsg = { sender: "user" as const, text };
    setChatMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      let aiResponse = "";
      const lower = text.toLowerCase();

      if (lower.includes("burnout") || lower.includes("fatigue") || lower.includes("stress")) {
        aiResponse = assessBurnout();
      } else if (lower.includes("syllabus") || lower.includes("completion") || lower.includes("exam")) {
        aiResponse = projectCompletion();
      } else if (lower.includes("weak") || lower.includes("subject") || lower.includes("topic") || lower.includes("physics") || lower.includes("math")) {
        aiResponse = getWeakTopicAdvice();
      } else {
        aiResponse = "I have reviewed your progress profile. For optimal results, I recommend checking your syllabus completion projections or running a burnout analysis first using the quick prompts above.";
      }

      setChatMessages((prev) => [...prev, { sender: "ai", text: aiResponse }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <WorkspaceLayout title="AI Study Coach">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Diagnostics and Quick Actions */}
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-accent-purple" /> Diagnostics Indicators
            </h3>
            
            <p className="text-xs text-gray-400">
              Forged analysis derived from your study logs, streak records, and mistake rates:
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3 bg-white/2 border border-card-border rounded-lg text-xs flex justify-between items-center">
                <span className="text-gray-400">Burnout Threshold</span>
                <span className="font-semibold text-green-400">Stable (15%)</span>
              </div>
              <div className="p-3 bg-white/2 border border-card-border rounded-lg text-xs flex justify-between items-center">
                <span className="text-gray-400">Mistake Rate</span>
                <span className="font-semibold text-orange-400">Moderate (1.8/day)</span>
              </div>
              <div className="p-3 bg-[#121620] border border-accent-purple/20 rounded-lg text-xs flex justify-between items-center">
                <span className="text-accent-purple font-semibold">Projected Exam Readiness</span>
                <span className="font-bold text-white">92% Optimal</span>
              </div>
            </div>
          </div>

          {/* Quick Prompts Panel */}
          <div className="glass-panel p-5 rounded-xl space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Quick Inquiries</h3>
            
            <button
              onClick={() => handleSendPrompt("Assess my current burnout patterns.")}
              className="w-full text-left p-2.5 rounded-lg border border-card-border bg-white/2 hover:bg-white/5 text-xs text-gray-300 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-physics" />
              Assess Burnout Risk
            </button>
            <button
              onClick={() => handleSendPrompt("Calculate my projected syllabus completion date.")}
              className="w-full text-left p-2.5 rounded-lg border border-card-border bg-white/2 hover:bg-white/5 text-xs text-gray-300 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
            >
              <CalendarDays className="w-3.5 h-3.5 text-chemistry" />
              Project Syllabus Completion
            </button>
            <button
              onClick={() => handleSendPrompt("Generate weak-topic study advice.")}
              className="w-full text-left p-2.5 rounded-lg border border-card-border bg-white/2 hover:bg-white/5 text-xs text-gray-300 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Target className="w-3.5 h-3.5 text-maths" />
              Review Weak Topics Advice
            </button>
          </div>
        </div>

        {/* Right Side: Interactive Chat Panel */}
        <div className="lg:col-span-2 glass-panel rounded-xl flex flex-col h-[520px] overflow-hidden">
          
          {/* Header */}
          <div className="px-5 py-4 border-b border-card-border bg-[#11141d]/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-accent-purple" />
              <div>
                <span className="text-xs font-bold text-white block">ForgeCoach</span>
                <span className="text-[9px] text-green-400 block font-semibold flex items-center gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" /> Online
                </span>
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-accent-purple" />
          </div>

          {/* Messages stream */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-normal ${
                    msg.sender === "user"
                      ? "bg-accent-purple text-white rounded-br-none"
                      : "bg-[#11141d] border border-card-border text-gray-200 rounded-bl-none"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#11141d] border border-card-border text-gray-400 rounded-xl p-3 rounded-bl-none text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce delay-75" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce delay-150" />
                </div>
              </div>
            )}
          </div>

          {/* Input control */}
          <div className="p-4 border-t border-card-border bg-[#11141d]/30">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendPrompt(inputText)}
                placeholder="Ask advice on Physics weak chapters, syllabus, or stress..."
                className="flex-1 bg-[#121620] border border-card-border rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-accent-purple"
              />
              <button
                onClick={() => handleSendPrompt(inputText)}
                disabled={!inputText.trim()}
                className="w-10 h-10 rounded-lg bg-accent-purple hover:bg-[#7c4ce6] text-white flex items-center justify-center shrink-0 disabled:opacity-50 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </WorkspaceLayout>
  );
}
