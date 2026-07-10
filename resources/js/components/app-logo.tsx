export default function AppLogo() {
    return (
        <div className="flex items-center gap-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-md bg-transparent">
                <img
                    src="/images/logo UAD putih.svg"
                    alt="ADLC"
                    className="h-10 w-10 object-contain"
                />
            </div>
            <div className="min-w-0 text-left text-sm leading-tight">
                <span className="block font-semibold">Ahmad Dahlan</span>
                <span className="block font-semibold">Language Center</span>
            </div>
        </div>
    );
}
