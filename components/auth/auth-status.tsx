"use client"

import { useAuth } from '@/contexts/auth-context'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Clock, Shield, User } from 'lucide-react'

export function AuthStatus() {
  const { isAuthenticated, admin, isLoading } = useAuth()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Authentication Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant="outline">Checking...</Badge>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Authentication Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <Badge variant={isAuthenticated ? "default" : "destructive"}>
            {isAuthenticated ? "Authenticated" : "Not Authenticated"}
          </Badge>
        </div>
        
        {admin && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="text-sm">
              Logged in as: <strong>{admin.username}</strong>
            </span>
          </div>
        )}
        
        {admin?.lastLogin && (
          <div className="text-xs text-muted-foreground">
            Last login: {new Date(admin.lastLogin).toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  )
}