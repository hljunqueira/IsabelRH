import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle, Trash2, UserX, Building2 } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'warning' | 'default';
  icon?: 'delete' | 'user' | 'building' | 'warning';
  onConfirm: () => void;
  loading?: boolean;
}

const iconMap = {
  delete: Trash2,
  user: UserX,
  building: Building2,
  warning: AlertTriangle,
};

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "destructive",
  icon = "warning",
  onConfirm,
  loading = false
}: ConfirmDialogProps) {
  const IconComponent = iconMap[icon];

  const getVariantColors = () => {
    switch (variant) {
      case 'destructive':
        return {
          iconColor: 'text-red-600',
          bgColor: 'bg-red-50',
          buttonClass: 'bg-red-600 hover:bg-red-700'
        };
      case 'warning':
        return {
          iconColor: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          buttonClass: 'bg-yellow-600 hover:bg-yellow-700'
        };
      default:
        return {
          iconColor: 'text-blue-600',
          bgColor: 'bg-blue-50',
          buttonClass: 'bg-blue-600 hover:bg-blue-700'
        };
    }
  };

  const colors = getVariantColors();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${colors.bgColor}`}>
              <IconComponent className={`h-6 w-6 ${colors.iconColor}`} />
            </div>
            <div>
              <AlertDialogTitle>{title}</AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="mt-3">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className={colors.buttonClass}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processando...
              </div>
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 