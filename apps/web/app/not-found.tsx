import Link from 'next/link';
export default function NotFound(){return <div className="emptyState"><strong>That evidence record is not present.</strong>The system does not invent a replacement. <div style={{marginTop:14}}><Link className="secondaryButton" href="/search">Search the knowledge base</Link></div></div>}
