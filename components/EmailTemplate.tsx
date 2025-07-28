
interface EmailTemplateProps {
  senderName: string;
  firstName: string;
  readingId: string;
}

const EmailTemplate = ({ senderName, firstName , readingId}: EmailTemplateProps) => {
  return (

    <div className="container">
    <div className="header">
      <img src="https://www.smoonai.top/images/logo.svg" alt="Seraphina Moon Logo" />
      <h1>You have Been Gifted a Reading</h1>
    </div>
    <div className="content">
      <h2>Hello <strong>{firstName}</strong>,</h2>
      <p>
        A little bit of stardust has found its way to you. <strong>{senderName}</strong> has sent you a gift from <em>Seraphina Moon</em>: a personalized tarot reading woven with magic, metaphor, and a touch of cosmic insight.
      </p>
      <p>
        This is not just a reading. It is an invitation. To pause. To wonder. To reflect. And maybe even to smile at what the cards whisper to you.
      </p>
      <p style="text-align: center;">
        <a href={'http://www.smoonai.top/readings/${readingId}'}>Open Your Tarot Gift</a>
      </p>
      <p>
        May this gift bring you clarity, curiosity, or perhaps just a moment of soulful delight.
      </p>
      <p style="font-style: italic;">With warmth and wonder,<br />— Seraphina Moon</p>
    </div>
    <div className="footer">
      You are receiving this email because someone thought you would enjoy a reading.
    </div>
  </div>

  )
}


export default EmailTemplate