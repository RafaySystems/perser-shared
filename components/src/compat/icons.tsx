import type React from 'react';
import {
  AlertCircle as AlertCircleLucide,
  AlertTriangle,
  ArrowDown as ArrowDownLucide,
  ArrowUp as ArrowUpLucide,
  Braces,
  Calendar as CalendarIcon,
  Check as CheckLucide,
  Clipboard,
  ChevronUp as ChevronUpIcon,
  ChevronDown as ChevronDownIcon,
  ChevronRight as ChevronRightIcon,
  Circle as CircleLucide,
  Copy,
  Download as DownloadLucide,
  Eye,
  EyeOff,
  ExternalLink,
  GripVertical,
  Info,
  Link as LinkLucide,
  Menu as MenuLucide,
  Minus as MinusLucide,
  MinusCircle,
  Pause as PauseLucide,
  Pencil as PencilLucide,
  Play as PlayLucide,
  RefreshCcw,
  RefreshCw,
  Search,
  ScanSearch,
  Send as SendLucide,
  Settings,
  Square,
  Bot,
  Pin as PinLucide,
  PinOff,
  PlusCircle,
  Plus as PlusLucide,
  Upload as UploadLucide,
  X,
  Zap,
  Droplets,
  Columns3,
  Globe,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeftOpen,
  Trash2,
} from 'lucide-react';

type IconProps = React.SVGProps<SVGSVGElement> & { sx?: any };
type IconComp = React.ComponentType<IconProps>;

const icon = (Comp: IconComp): IconComp => (props) => <Comp width={18} height={18} {...props} />;

export const AddIcon = icon(PlusLucide);
export const PlusIcon = icon(PlusLucide);
export const DeleteIcon = icon(Trash2);
export const Close = icon(X);
export const CloseIcon = icon(X);
export const CircleIcon = icon(CircleLucide);
export const DragIcon = icon(GripVertical);
export const DragVertical = icon(GripVertical);
export const Calendar = icon(CalendarIcon);
export const EarthIcon = icon(Globe);
export const Magnify = icon(Search);
export const ViewColumn = icon(Columns3);
export const UnfoldMore = icon(PanelLeftOpen);
export const UnfoldLess = icon(PanelLeftClose);
export const ChevronRight = icon(ChevronRightIcon);
export const ChevronDown = icon(ChevronDownIcon);
export const EyeOffIcon = icon(EyeOff);
export const EyeIcon = icon(Eye);
export const InformationOutlineIcon = icon(Info);
export const PinOutline = icon(PinOff);
export const Pin = icon(PinLucide);
export const PinIcon = icon(PinLucide);

// MDI compatibility aliases.
export const Plus = icon(PlusLucide);
export const PencilOutline = icon(PencilLucide);
export const Pencil = icon(PencilLucide);
export const TrashCan = icon(Trash2);
export const DeleteOutline = icon(Trash2);
export const ArrowUpIcon = icon(ArrowUpLucide);
export const ArrowDownIcon = icon(ArrowDownLucide);
export const ArrowUp = ArrowUpIcon;
export const ArrowDown = ArrowDownIcon;
export const ChevronUp = icon(ChevronUpIcon);
export const ChartBoxPlusOutline = icon(PlusLucide);
export const PlusBoxOutline = icon(PlusLucide);
export const ContentCopy = icon(Copy);
export const ContentDuplicate = icon(Copy);
export const OpenInNew = icon(ExternalLink);
export const Launch = icon(ExternalLink);
export const DownloadOutline = icon(DownloadLucide);
export const CodeBraces = icon(Braces);
export const Menu = icon(MenuLucide);
export const Alert = icon(AlertTriangle);
export const AlertCircle = icon(AlertCircleLucide);
export const LightningBolt = icon(Zap);
export const DatabaseSearch = icon(Search);
export const ArrowCollapse = icon(Minimize2);
export const ArrowExpand = icon(Maximize2);
// Keep sidebar-panel aliases available for other callers.
export const PanelCollapse = icon(PanelLeftClose);
export const PanelExpand = icon(PanelLeftOpen);
export const PinOffOutline = icon(PinOff);
export const InformationOutline = icon(Info);
export const Check = icon(CheckLucide);
export const Cog = icon(Settings);
export const Link = icon(LinkLucide);
export const MagnifyScan = icon(ScanSearch);
export const Pause = icon(PauseLucide);
export const Play = icon(PlayLucide);
export const Refresh = icon(RefreshCw);
export const RobotOutline = icon(Bot);
export const Send = icon(SendLucide);
export const Stop = icon(Square);
export const Sync = icon(RefreshCcw);
export const Upload = icon(UploadLucide);
export const Minus = icon(MinusLucide);
export const InvertColors = icon(Droplets);
export const ClipboardOutline = icon(Clipboard);
export const PlusCircleOutline = icon(PlusCircle);
export const MinusCircleOutline = icon(MinusCircle);
export const Reload = icon(RefreshCw);
export const Download = icon(DownloadLucide);

