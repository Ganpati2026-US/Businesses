interface BrandFooterProps {
    className?: string;
    color?: string;
    borderColor?: string;
    showDivider?: boolean;
}

export function BrandFooter({ className = '', color = '#71717a', borderColor = '#e4e4e7', showDivider = true }: BrandFooterProps) {
    return (
        <footer
            className={`text-center ${showDivider ? 'border-t' : ''} ${className}`}
            style={{ color, borderColor, fontFamily: "'Inter', system-ui, sans-serif" }}
            aria-label="Product attribution"
        >
            <p className="text-sm font-bold tracking-tight" style={{ color: '#7c3aed' }}>BitByte</p>
            <p className="mt-0.5 text-xs font-medium">by Appetiser India</p>
        </footer>
    );
}
