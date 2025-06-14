import { Leaf, Users, Shield, Truck, Heart, Instagram, Linkedin, Twitter } from 'lucide-react';


export default function Footer() {

    const socialLinks = [
        {
            Icon: Twitter,
            href: "#",
            color: "text-blue-400",
            hoverColor: "bg-blue-500"
        },
        {
            Icon: Instagram,
            href: "#",
            color: "text-pink-500",
            hoverColor: "bg-pink-500"
        },
        {
            Icon: Linkedin,
            href: "#",
            color: "text-blue-400",
            hoverColor: "bg-blue-500"
        }
    ];
    return (
        <div className="border-t border-blue-900/30 py-12 mt-auto bg-card-base-100">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h3 className="text-white font-semibold mb-4">Azienda</h3>
                        <ul className="space-y-2">
                            <li><a href="/homepage/about" className="text-gray-400 hover:text-white transition-colors">Chi siamo</a></li>
                            <li><a href="/homepage/about/collaboratori" className="text-gray-400 hover:text-white transition-colors">Collaboratori</a></li>
                            <li><a href="/homepage/about/blog" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                            <li><a href="/homepage/about/contatti" className="text-gray-400 hover:text-white transition-colors">Contatti</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Impatto</h3>
                        <ul className="space-y-2">
                            <li><a href="/homepage/about/sostenibilita" className="text-gray-400 hover:text-white transition-colors">Report sostenibilità</a></li>
                            <li><a href="/homepage/about/footprint" className="text-gray-400 hover:text-white transition-colors">Impronta ecologica</a></li>
                            <li><a href="/homepage/about/partnership" className="text-gray-400 hover:text-white transition-colors">Partnership green</a></li>
                            <li><a href="/homepage/about/certificazioni" className="text-gray-400 hover:text-white transition-colors">Certificazioni</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2">
                            <li><a href="/homepage/about/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="/homepage/about/termini" className="text-gray-400 hover:text-white transition-colors">Termini di servizio</a></li>
                            <li><a href="/homepage/about/cookie" className="text-gray-400 hover:text-white transition-colors">Preferenze cookie</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Seguici</h3>
                        <div className="flex gap-2">
                            {socialLinks.map(({ Icon, href, color, hoverColor }) => (
                                <a
                                    key={href}
                                    href={href}
                                    className={`btn btn-square btn-sm border border-blue-900/30 bg-neutral ${color} hover:${hoverColor} hover:text-white`}
                                >
                                    <Icon stroke="currentColor" size={18} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-blue-900/30 pt-8">
                    <div className="text-center text-gray-400">
                        <p>© 2025 JustWeed. Tutti i diritti riservati |
                            <a href="/homepage/about/termini" className="hover:text-white ml-2">Termini e Condizioni</a>
                        </p>
                        <p className="mt-2 text-sm">P.IVA 01234567890 | Registro Imprese Milano</p>
                    </div>
                </div>
            </div>
        </div>
    )
}