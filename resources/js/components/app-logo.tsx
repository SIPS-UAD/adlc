export default function AppLogo() {
    return (
       <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
            <div className="flex h-14 w-14 items-center justify-center rounded-md bg-transparent group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8">
                <img
                    src="/images/logo UAD putih.svg"
                    alt="ADLC"
                    className="h-10 w-10 object-contain group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6"
                />
            </div>
            <div className="min-w-0 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="block font-semibold">Ahmad Dahlan</span>
                <span className="block font-semibold">Language Center</span>
            </div>
        </div>
    );
}
