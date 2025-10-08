import React, { useState } from 'react'
import { CommunityPost } from '../../lib/supabase'
import { MessageSquare, Heart, Clock, User } from 'lucide-react'
import { format } from 'date-fns'

interface PostCardProps {
  post: CommunityPost
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [showComments, setShowComments] = useState(false)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'anxiety': return 'bg-blue-100 text-blue-800'
      case 'depression': return 'bg-purple-100 text-purple-800'
      case 'stress': return 'bg-red-100 text-red-800'
      case 'success': return 'bg-green-100 text-green-800'
      case 'resources': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDisplayName = () => {
    if (post.anonymous) {
      return 'Anonymous'
    }
    return post.profiles?.full_name || post.profiles?.username || 'User'
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Post Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {post.anonymous ? (
                <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
              ) : (
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-sm">
                    {getDisplayName().charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-900">{getDisplayName()}</p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{format(new Date(post.created_at), 'MMM dd, yyyy')}</span>
              </div>
            </div>
          </div>
          
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(post.category)}`}>
            {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
          </span>
        </div>

        {/* Post Content */}
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">{post.title}</h3>
          <div className="text-gray-700 whitespace-pre-wrap">
            {post.content.length > 300 ? (
              <>
                {post.content.slice(0, 300)}...
                <button className="text-blue-600 hover:text-blue-800 ml-1">
                  Read more
                </button>
              </>
            ) : (
              post.content
            )}
          </div>
        </div>

        {/* Post Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors">
              <Heart className="h-4 w-4" />
              <span className="text-sm">Support</span>
            </button>
            
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm">Comment</span>
            </button>
          </div>
          
          <div className="text-xs text-gray-500">
            {post.anonymous && (
              <span className="bg-gray-100 px-2 py-1 rounded-full">Anonymous post</span>
            )}
          </div>
        </div>

        {/* Comments Section (placeholder) */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-500 text-center py-4">
              Comments feature coming soon...
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PostCard