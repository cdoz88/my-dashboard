import React from 'react';
import { 
  // Business & Finance
  Briefcase, Building2, Building, Landmark, Banknote, Wallet, PiggyBank, PieChart, BarChart, TrendingUp, LineChart, Presentation, Scale, Store,
  // Sports, Fitness & Competition
  Trophy, Medal, Award, Dumbbell, Target, Goal, Crosshair, Flag, Swords,
  // Media & Creator
  Mic, Headphones, Headset, Video, Camera, Clapperboard, Film, Tv, MonitorPlay, Radio, Image as ImageIcon,
  // Tech & IT
  Code, Database, Server, Cloud, Globe, Smartphone, Laptop, Monitor, Wifi, Zap, ShieldCheck, Lock,
  // E-commerce & Shopping
  ShoppingCart, ShoppingBag, Ticket, Box,
  // General & Branding
  Star, Heart, Crown, Flame, Rocket, Coffee, Music, MapPin, Compass, Smile, ThumbsUp,
  // UI & Planning
  FolderKanban, Users, CalendarDays, Mail, Settings, PenTool, FileText, Upload, RefreshCw
} from 'lucide-react';

const iconMap = { 
  Briefcase, Building2, Building, Landmark, Banknote, Wallet, PiggyBank, PieChart, BarChart, TrendingUp, LineChart, Presentation, Scale, Store,
  Trophy, Medal, Award, Dumbbell, Target, Goal, Crosshair, Flag, Swords,
  Mic, Headphones, Headset, Video, Camera, Clapperboard, Film, Tv, MonitorPlay, Radio, ImageIcon,
  Code, Database, Server, Cloud, Globe, Smartphone, Laptop, Monitor, Wifi, Zap, ShieldCheck, Lock,
  ShoppingCart, ShoppingBag, Ticket, Box,
  Star, Heart, Crown, Flame, Rocket, Coffee, Music, MapPin, Compass, Smile, ThumbsUp,
  FolderKanban, Users, CalendarDays, Mail, Settings, PenTool, FileText, Upload, RefreshCw
};

export const availableIcons = Object.keys(iconMap);

export default function DynamicIcon({ name, className, size }) {
  const Icon = iconMap[name] || iconMap['Briefcase'];
  return <Icon className={className} size={size} />;
}