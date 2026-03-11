import React from 'react';
import { 
  Building2, Globe, Smartphone, Megaphone, ShoppingCart, 
  Rocket, Code, Monitor, Heart, Star, Briefcase, FolderKanban,
  Users, Settings, Mail, Camera, Box, PenTool, Database, Cloud, 
  FileText, Zap, Compass, MapPin, Coffee, Music, Image as ImageIcon, 
  FileVideo, Shield, Target, Award, Crown, Upload, RefreshCw,
  CalendarDays, Ticket, Mic, Headphones
} from 'lucide-react';

const iconMap = { 
  Building2, Globe, Smartphone, Megaphone, ShoppingCart, 
  Rocket, Code, Monitor, Heart, Star, Briefcase, FolderKanban,
  Users, Settings, Mail, Camera, Box, PenTool, Database, Cloud, 
  FileText, Zap, Compass, MapPin, Coffee, Music, ImageIcon, 
  FileVideo, Shield, Target, Award, Crown, Upload, RefreshCw,
  CalendarDays, Ticket, Mic, Headphones
};

export const availableIcons = Object.keys(iconMap);

export default function DynamicIcon({ name, className, size }) {
  const Icon = iconMap[name] || iconMap['Briefcase'];
  return <Icon className={className} size={size} />;
}