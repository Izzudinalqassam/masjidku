import { prisma } from "@/lib/prisma"
import { CategoryManager } from "@/components/categories/category-manager"

export const dynamic = "force-dynamic"

export default async function CategoriesPage() {
    const categories = await prisma.category.findMany({
        orderBy: {
            name: 'asc'
        }
    })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Kategori</h1>
                <p className="text-muted-foreground mt-1">
                    Kelola kategori pemasukan dan pengeluaran untuk pencatatan yang lebih rapi.
                </p>
            </div>

            <CategoryManager initialCategories={categories} />
        </div>
    )
}
