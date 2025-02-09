"use client";
import React from 'react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Card } from '../ui/card';
import { Trophy, Star, Target, Clock, Flame } from 'lucide-react';
import { getProductivityMetrics, getUnlockedAchievements } from '@/lib/statistics';
import { useToast } from '../ui/use-toast';
import Confetti from './Confetti';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactElement;
  isUnlocked: boolean;
  progress: number;
  target: number;
}

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    async function loadAchievements() {
      if (!user) return;
      
      const metrics = await getProductivityMetrics(user.id, 'month');
      const unlocked = await getUnlockedAchievements(user.id);
      const previouslyUnlocked = new Set(unlocked.map(a => a.id));
      
      const achievementsList: Achievement[] = [
        {
          id: 'focus-master',
          title: 'Focus Master',
          description: 'Complete 10 focus sessions',
          icon: <Clock className="h-6 w-6 text-blue-500" />,
          isUnlocked: metrics.sessions.completed >= 10,
          progress: metrics.sessions.completed,
          target: 10
        },
        {
          id: 'productivity-streak',
          title: 'Productivity Streak',
          description: 'Maintain a 5-day streak',
          icon: <Flame className="h-6 w-6 text-orange-500" />,
          isUnlocked: metrics.streaks.current >= 5,
          progress: metrics.streaks.current,
          target: 5
        },
        {
          id: 'task-champion',
          title: 'Task Champion',
          description: 'Complete 20 tasks',
          icon: <Target className="h-6 w-6 text-green-500" />,
          isUnlocked: metrics.tasks.completed >= 20,
          progress: metrics.tasks.completed,
          target: 20
        },
        {
          id: 'consistency-king',
          title: 'Consistency King',
          description: 'Achieve 80% completion rate',
          icon: <Star className="h-6 w-6 text-yellow-500" />,
          isUnlocked: metrics.tasks.completionRate >= 0.8,
          progress: Math.round(metrics.tasks.completionRate * 100),
          target: 80
        },
        {
          id: 'productivity-expert',
          title: 'Productivity Expert',
          description: 'Reach a productivity score of 90',
          icon: <Trophy className="h-6 w-6 text-purple-500" />,
          isUnlocked: metrics.productivityScore >= 90,
          progress: metrics.productivityScore,
          target: 90
        }
      ];

      // Check for newly unlocked achievements
      let hasNewAchievement = false;
      achievementsList.forEach(achievement => {
        if (achievement.isUnlocked && !previouslyUnlocked.has(achievement.id)) {
          hasNewAchievement = true;
          toast({
            title: "🎉 Achievement Unlocked!",
            description: `${achievement.title} - ${achievement.description}`,
            variant: "default",
            className: "bg-green-50 border-green-200",
            duration: 5000,
          });
        }
      });

      if (hasNewAchievement) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }

      setAchievements(achievementsList);
    }

    loadAchievements();
  }, [user, toast]);

  return (
    <>
      {showConfetti && <Confetti />}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">
          Achievements 
          <span className="ml-2 text-sm text-gray-500">
            {achievements.filter(a => a.isUnlocked).length} / {achievements.length} unlocked
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border ${
                achievement.isUnlocked
                  ? 'bg-gradient-to-br from-white to-gray-50 shadow-md scale-100'
                  : 'bg-gray-50 opacity-75 scale-95'
              } transition-all duration-300 hover:shadow-lg transform hover:scale-105`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${
                  achievement.isUnlocked 
                    ? 'bg-white shadow-sm animate-bounce' 
                    : 'bg-gray-100'
                }`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{achievement.title}</h4>
                  <p className="text-sm text-gray-500">{achievement.description}</p>
                  <div className="mt-2">
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          achievement.isUnlocked ? 'bg-green-500' : 'bg-blue-500'
                        } transition-all duration-1000 ease-out`}
                        style={{
                          width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%`
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {achievement.progress} / {achievement.target}
                      {achievement.isUnlocked && (
                        <span className="ml-2 text-green-500">✓ Complete!</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}