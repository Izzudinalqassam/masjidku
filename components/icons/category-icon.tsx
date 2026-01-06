import {
    Wallet,
    HandCoins,
    Landmark,
    Briefcase,
    ShoppingCart,
    Lightbulb,
    Wrench,
    Heart,
    Utensils,
    Bus,
    GraduationCap,
    Zap,
    Tags,
    MoreHorizontal
} from "lucide-react"

export const CategoryIcon = ({ iconName, className }: { iconName?: string, className?: string }) => {
    const icons: Record<string, any> = {
        wallet: Wallet,
        'hand-coins': HandCoins,
        landmark: Landmark,
        briefcase: Briefcase,
        shopping: ShoppingCart,
        lightbulb: Lightbulb,
        wrench: Wrench,
        heart: Heart,
        food: Utensils,
        transport: Bus,
        education: GraduationCap,
        energy: Zap,
        settings: Wrench,
        tags: Tags,
        more: MoreHorizontal
    }

    const Icon = icons[iconName || 'wallet'] || Wallet
    return <Icon className={className} />
}

export const iconOptions = [
    { value: 'wallet', label: 'Dompet' },
    { value: 'hand-coins', label: 'Donasi' },
    { value: 'landmark', label: 'Bank' },
    { value: 'briefcase', label: 'Bisnis' },
    { value: 'shopping', label: 'Belanja' },
    { value: 'lightbulb', label: 'Listrik' },
    { value: 'wrench', label: 'Servis' },
    { value: 'heart', label: 'Sosial' },
    { value: 'food', label: 'Makanan' },
    { value: 'transport', label: 'Transport' },
    { value: 'education', label: 'Pendidikan' },
    { value: 'energy', label: 'Energi' },
    { value: 'tags', label: 'Lainnya' },
]
