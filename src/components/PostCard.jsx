import { Avatar } from './Avatar'
import { Icon } from './Icon'
import { useApp } from '../store/AppContext'
import { personById } from '../store/selectors'
import { timeAgo } from '../lib/format'

export function PostCard({ post }) {
  const { state, me, api } = useApp()
  const author = personById(state, post.authorId)
  const liked = post.likedBy.includes(me.id)
  return (
    <article className="post">
      <div className="post-head">
        <Avatar name={author.name} color={author.color} size={34} />
        <div className="m"><b>{author.id === me.id ? `${author.name} (you)` : author.name}</b><small>{timeAgo(post.at)} · {post.category}</small></div>
      </div>
      <p>{post.body}</p>
      <button className={`like${liked ? ' on' : ''}`} onClick={() => api.toggleLike(post.id)} aria-pressed={liked}>
        <Icon name="heart" size={16} filled={liked} /> {post.likedBy.length}
      </button>
    </article>
  )
}
