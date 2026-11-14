import { go } from '../hooks/useHashRoute'

export default function About({ active }: { active: boolean }) {
  return (
    <section id="about" className={'view' + (active ? ' on' : '')}>
      <div className="hero">
        <img className="hero-logo" src="/res/plusonelogo.png" alt="+1 Hi-Lo card counting trainer" />
        <p>
          Learn to count cards the way it happens at a real table: several hands, cards falling fast, one running
          number in your head.
        </p>
        <button className="btn" onClick={() => go('practice')}>
          Start practice
        </button>
      </div>
      <h2>What is Hi-Lo?</h2>
      <p>
        Hi-Lo is the most popular card counting system. Every card you see changes a running count by +1, 0 or −1. A
        high count means the shoe has more tens and aces left, which favors the player.
      </p>
      <div className="vals">
        <div>
          <b style={{ color: '#1f7a4d' }}>+1</b>
          <span>2 3 4 5 6</span>
        </div>
        <div>
          <b>0</b>
          <span>7 8 9</span>
        </div>
        <div>
          <b style={{ color: '#b3362c' }}>−1</b>
          <span>10 J Q K A</span>
        </div>
      </div>
      <p>
        Start at 0 on a fresh shoe. Divide the running count by the decks still in the shoe to get the true count.
        Practice mode quizzes you on the count after each round. Playing mode lets you play blackjack with $25 while
        you keep count.
      </p>
      <p style={{ color: 'var(--mute)' }}>
        Counting is legal, but casinos can ask you to leave. Online games reshuffle constantly, so counting only works
        on a real shoe.
      </p>
    </section>
  )
}
