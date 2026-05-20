import { Navigate, useParams } from 'react-router-dom';
import { resolveMantraMeta } from '../data/mantraCatalog';

const LegacyMantraRedirect = () => {
  const { mantraId } = useParams();
  const resolved = resolveMantraMeta({ id: mantraId, slug: mantraId, name: mantraId });

  if (!resolved?.slug) {
    return <Navigate to="/mantras" replace />;
  }

  return <Navigate to={`/mantras/${resolved.slug}`} replace />;
};

export default LegacyMantraRedirect;