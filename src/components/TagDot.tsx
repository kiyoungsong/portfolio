import { tagColor, type TagId } from '../data/projects';

export const TagDot = ({ tag, size = 9 }: { tag: TagId; size?: number }) => (
  <span className="inline-block flex-none rounded-full" style={{ background: tagColor(tag), width: size, height: size }} />
);
