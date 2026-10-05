export function AuthLayout({ children, title, loginStyle = false }: Readonly<{ children: React.ReactNode; title: string; loginStyle?: boolean }>) {
  return (
    <main className={`flex min-h-screen flex-col px-5 ${loginStyle ? "items-start" : "items-center"}`}>
      <section className={`w-full ${loginStyle ? "mt-[15px] max-w-[550px]" : "mt-[11vh] max-w-[360px]"}`}>
        <h1 className={`font-semibold tracking-tight text-[#18232b] ${loginStyle ? "mb-[53px] text-[30px] leading-9" : "mb-5 text-[18px]"}`}>{title}</h1>
        {children}
      </section>
      {!loginStyle && <footer className="mt-auto mb-7 w-full max-w-[1280px] border-t border-[#e3e8eb] pt-4 text-center text-xs text-[#93a0a8]">Gemstone Management System</footer>}
    </main>
  );
}
