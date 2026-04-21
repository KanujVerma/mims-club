import './FeedbackMessage.css'

export default function FeedbackMessage({ visible }) {
  return (
    <p
      className={`feedback-message${visible ? ' feedback-message--visible' : ''}`}
      aria-live="polite"
      aria-atomic="true"
    >
      {visible ? '✓ Saved to My Events' : ''}
    </p>
  )
}
