import { prisma } from './prisma'

interface AuditLogData {
    userId?: string
    action: string
    entityType: string
    entityId?: string
    oldData?: any
    newData?: any
    ipAddress?: string
    userAgent?: string
}

export async function createAuditLog(data: AuditLogData) {
    try {
        await prisma.auditLog.create({
            data: {
                userId: data.userId,
                action: data.action,
                entityType: data.entityType,
                entityId: data.entityId,
                oldData: data.oldData || null,
                newData: data.newData || null,
                ipAddress: data.ipAddress,
                userAgent: data.userAgent,
            },
        })
    } catch (error) {
        console.error('Failed to create audit log:', error)
        // Don't throw - audit logging should not break the main flow
    }
}

export function getClientInfo(request: Request) {
    const ipAddress = request.headers.get('x-forwarded-for') ||
        request.headers.get('x-real-ip') ||
        'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    return { ipAddress, userAgent }
}
