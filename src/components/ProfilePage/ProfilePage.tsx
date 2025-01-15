import React, { useState } from 'react';
import { ProfileHeader } from './ProfileHeader';
import { BlogEditor } from './BlogEditor';
import { BlogList } from './BlogList';
import { Sidebar } from './Sidebar';
import { UserProfile, BlogPost, RecommendedMatch, Community } from '../../types/profile';
import { PenSquare } from 'lucide-react';

// Mock data
const initialProfile: UserProfile = {
  id: '1',
  name: 'Jenny Jones',
  role: 'Entrepreneur',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
  backgroundImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
  bio: 'Passionate entrepreneur focused on creating innovative solutions in the EdTech space. Looking to connect with like-minded individuals and potential co-founders.',
  location: 'San Francisco, CA',
  skills: ['Product Strategy', 'Team Building', 'EdTech'],
  interests: ['Education', 'AI/ML', 'Startups'],
  blogs: [
    {
      id: '1',
      title: 'The Future of EdTech: AI-Powered Learning',
      content: "As we move into a new era of education, artificial intelligence is playing an increasingly crucial role in how we learn and teach. Through my experience in the EdTech space, I have observed several emerging trends that are reshaping the educational landscape. From personalized learning paths to intelligent tutoring systems, AI is transforming how we approach education. The integration of machine learning algorithms allows us to better understand student behavior, predict learning outcomes, and provide targeted interventions when needed.",
      createdAt: '2024-03-15T08:00:00.000Z',
      tags: ['EdTech', 'AI', 'Future of Learning']
    },
    {
      id: '2',
      title: 'Building Successful Co-Founder Relationships',
      content: "Finding the right co-founder is like finding a life partner for your business. Over the years, I have learned valuable lessons about what makes co-founder relationships work. Trust, complementary skills, and shared values form the foundation of any successful partnership. Communication is key - regular check-ins, honest feedback, and clear expectations help prevent misunderstandings and keep the relationship strong.",
      createdAt: '2024-03-10T10:30:00.000Z',
      tags: ['Startups', 'Leadership', 'Partnerships']
    },
    {
      id: '3',
      title: 'Scaling Your EdTech Startup: Lessons Learned',
      content: "After three years of building and scaling my EdTech venture, I have encountered numerous challenges and victories. In this post, I will share the most important lessons learned about growing an education technology company. From product-market fit to building the right team, every step of the journey has provided valuable insights into what makes a successful EdTech startup.",
      createdAt: '2024-03-05T15:45:00.000Z',
      tags: ['Growth', 'EdTech', 'Entrepreneurship']
    }
  ]
};

const recommendedMatches: RecommendedMatch[] = [
  {
    id: '1',
    name: 'Alex Chen',
    role: 'Tech Lead',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    matchPercentage: 92,
    sharedInterests: ['EdTech', 'AI']
  },
  {
    id: '2',
    name: 'Sarah Miller',
    role: 'Product Manager',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    matchPercentage: 88,
    sharedInterests: ['Startups', 'Education']
  }
];

const activeCommunities: Community[] = [
  {
    id: '1',
    name: 'EdTech Innovators',
    memberCount: 1234,
    category: 'Education',
    icon: '📚'
  },
  {
    id: '2',
    name: 'AI Startups',
    memberCount: 5678,
    category: 'Technology',
    icon: '🤖'
  }
];

export function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    setProfile({ ...profile, ...updates });
  };

  const handleSaveBlog = (post: Omit<BlogPost, 'id' | 'createdAt'>) => {
    const newPost: BlogPost = {
      ...post,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    handleUpdateProfile({
      blogs: [newPost, ...profile.blogs]
    });
    setIsEditing(false);
  };

  const handleDeleteBlog = (postId: string) => {
    handleUpdateProfile({
      blogs: profile.blogs.filter(post => post.id !== postId)
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader profile={profile} onUpdateProfile={handleUpdateProfile} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-8 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Blog Posts</h2>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors"
              >
                <PenSquare className="w-4 h-4" />
                Write Blog
              </button>
            </div>
            
            <BlogList
              posts={profile.blogs}
              onEdit={() => {}}
              onDelete={handleDeleteBlog}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar
              recommendedMatches={recommendedMatches}
              activeCommunities={activeCommunities}
            />
          </div>
        </div>
      </div>

      {/* Blog Editor Modal */}
      {isEditing && (
        <BlogEditor
          onSave={handleSaveBlog}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
  );
}