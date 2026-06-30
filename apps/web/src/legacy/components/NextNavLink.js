import Link from 'next/link';

export function NavLink({ to, href, end: _end, children, ...props }) {
  const target = to || href || '#';
  return (
    <Link href={target} {...props}>
      {children}
    </Link>
  );
}
