import { BottomNav } from '../components/BottomNav'
import { PostCard } from '../components/PostCard'
import { ScreenHeader } from '../components/ScreenHeader'
import { useApp } from '../store/AppContext'
import { useUI } from '../store/UIContext'

export default function Feed() {
  const { state, me } = useApp()
  const { openSheet } = useUI()
  return (
    <section className="screen">
      <ScreenHeader title="Campus Feed" />
      <div className="h-body">
        <button className="composer-cta" onClick={() => openSheet('post')}>
          <span>What’s happening on campus, {me.name.split(' ')[0]}?</span><span className="jb">Post</span>
        </button>
        {state.posts.map((p) => <PostCard key={p.id} post={p} />)}
      </div>
      <BottomNav />
    </section>
  )
}
