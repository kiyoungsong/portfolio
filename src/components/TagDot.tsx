import { tagColor, type TagId } from '../data/projects';

export const TagDot = ({ tag, size = 9 }: { tag: TagId; size?: number }) => (
  <span className="tagdot" style={{ background: tagColor(tag), width: size, height: size }} />
);
