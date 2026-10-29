// page provisoire, à remplacer par la vraie page de la story.
export default function AFaire({ titre, stories }) {
  return (
    <section>
      <h1>{titre}</h1>
      <p className="a-faire">À construire — {stories}</p>
    </section>
  )
}
