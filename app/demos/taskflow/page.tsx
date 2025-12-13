"use client";

import { useState, useEffect, useRef, forwardRef, useMemo, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  CheckSquare,
  Settings,
  Plus,
  Filter,
  ArrowUpDown,
  Menu,
  X,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  Calendar,
  Bell,
  User,
  Mail,
  Search,
  HelpCircle,
  Loader2,
  CheckCircle,
} from "lucide-react"

// 替代 Button 組件
const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "ghost" | "outline"
    size?: "md" | "icon" | "sm"
  }
>(({ children, variant = "default", size = "md", className = "", ...props }, ref) => {
    let base =
      "inline-flex items-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
    let variants: Record<string, string> = {
      default: "bg-blue-600 hover:bg-blue-700 text-white",
      ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
      outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  }
  let sizes: Record<string, string> = {
    md: "px-4 py-2 h-10 text-sm",
    sm: "px-3 py-1.5 h-8 text-sm",
    icon: "p-0 h-10 w-10 justify-center",
  }
  // 兼容可能出現的組合
  let variantClass =
    variants[variant] ||
    (className.includes("bg-secondary") && variants.secondary) ||
    ""
  let sizeClass = sizes[size] || ""
  return (
    <button
      ref={ref}
      className={[base, variantClass, sizeClass, className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  )
})
Button.displayName = "Button"

// 替代 Avatar 組件
function Avatar({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={`inline-flex relative overflow-hidden rounded-full bg-gray-100 ${className}`}
      style={{ minWidth: 32, minHeight: 32 }}
    >
      {children}
    </span>
  )
}
function AvatarImage({
  src,
  alt,
}: {
  src?: string
  alt?: string
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="object-cover w-full h-full"
      style={{ minWidth: 32, minHeight: 32 }}
    />
  )
}
function AvatarFallback({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={`flex items-center justify-center absolute inset-0 text-gray-500 bg-gray-200 ${className}`}
    >
      {children}
    </span>
  )
}

// 替代 Card 組件
function Card({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`rounded-lg shadow-sm bg-white ${className}`} {...props}>
      {children}
    </div>
  )
}

// Toggle Switch 組件
function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          checked ? "bg-blue-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  )
}

interface Comment {
  id: string
  user: { name: string; avatar?: string }
  text: string
  timestamp: Date
}

interface Task {
  id: string
  title: string
  tag: { label: string; color: string }
  assignee: { name: string; avatar: string }
  priority: "high" | "medium" | "low"
  description?: string
  dueDate?: string
  status: "todo" | "in-progress" | "done"
  comments?: Comment[]
}

// 初始任務資料
const INITIAL_TASKS: Task[] = [
        {
          id: "1",
          title: "Design user onboarding flow",
          tag: { label: "Design", color: "bg-purple-500" },
          assignee: { name: "Sarah Chen", avatar: "/placeholder.svg?height=32&width=32" },
          priority: "high",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    dueDate: "2024-01-15",
    status: "todo",
    comments: [
      {
        id: "c1",
        user: { name: "John Doe" },
        text: "Great progress on this! Let me know if you need any clarification.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        id: "c2",
        user: { name: "Sarah Chen" },
        text: "Thanks! I'll update the design based on your feedback.",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      },
    ],
        },
        {
          id: "2",
          title: "Research competitor features",
          tag: { label: "Research", color: "bg-yellow-500" },
          assignee: { name: "Mike Ross", avatar: "/placeholder.svg?height=32&width=32" },
          priority: "medium",
    description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    dueDate: "2024-01-20",
    status: "todo",
        },
        {
          id: "3",
          title: "Create wireframes for dashboard",
          tag: { label: "Design", color: "bg-purple-500" },
          assignee: { name: "Sarah Chen", avatar: "/placeholder.svg?height=32&width=32" },
          priority: "medium",
    description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
    dueDate: "2024-01-18",
    status: "todo",
    },
        {
          id: "4",
          title: "Implement authentication system",
          tag: { label: "Backend", color: "bg-blue-500" },
          assignee: { name: "Alex Kim", avatar: "/placeholder.svg?height=32&width=32" },
          priority: "high",
    description: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
    dueDate: "2024-01-22",
    status: "in-progress",
        },
        {
          id: "5",
          title: "Design component library",
          tag: { label: "Design", color: "bg-purple-500" },
          assignee: { name: "Sarah Chen", avatar: "/placeholder.svg?height=32&width=32" },
          priority: "medium",
    description: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
    dueDate: "2024-01-25",
    status: "in-progress",
    },
        {
          id: "6",
          title: "Set up project repository",
          tag: { label: "DevOps", color: "bg-green-500" },
          assignee: { name: "Alex Kim", avatar: "/placeholder.svg?height=32&width=32" },
          priority: "medium",
    description: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.",
    dueDate: "2024-01-10",
    status: "done",
        },
        {
          id: "7",
          title: "Define project requirements",
          tag: { label: "Planning", color: "bg-pink-500" },
          assignee: { name: "Mike Ross", avatar: "/placeholder.svg?height=32&width=32" },
          priority: "high",
    description: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.",
    dueDate: "2024-01-05",
    status: "done",
  },
]

// Tag 顏色映射
const getTagColor = (tagLabel: string): string => {
  const tagColors: Record<string, string> = {
    "Design": "bg-purple-500",
    "Research": "bg-yellow-500",
    "Backend": "bg-blue-500",
    "DevOps": "bg-green-500",
    "Planning": "bg-pink-500",
    "Dev": "bg-indigo-500",
    "Frontend": "bg-cyan-500",
  }
  return tagColors[tagLabel] || "bg-gray-500"
}

interface Column {
  id: string
  title: string
  tasks: Task[]
}

export default function Dashboard() {
  // 任務狀態管理
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"dashboard" | "my-tasks" | "settings">("dashboard")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false)
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<"filter" | "sort" | null>(null)
  const [filterOptions, setFilterOptions] = useState({
    myTasksOnly: false,
    highPriority: false,
    dueThisWeek: false,
  })
  const [sortOption, setSortOption] = useState<string>("Date Created")
  const [searchQuery, setSearchQuery] = useState("")
  const [hasNotifications, setHasNotifications] = useState(true)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "info">("info")
  const [commentText, setCommentText] = useState("")
  const [isSavingSettings, setIsSavingSettings] = useState(false)
  
  // Refs for click outside detection
  const filterDropdownRef = useRef<HTMLDivElement>(null)
  const sortDropdownRef = useRef<HTMLDivElement>(null)
  const filterButtonRef = useRef<HTMLButtonElement>(null)
  const sortButtonRef = useRef<HTMLButtonElement>(null)
  
  // Settings 狀態
  const [settings, setSettings] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    notifications: {
      email: true,
      push: false,
      taskUpdates: true,
    },
  })
  
  // New Project Modal 狀態
  const [newProjectData, setNewProjectData] = useState({
    name: "",
    template: "Blank",
  })
  
  // New Task Modal 狀態
  const [newTaskData, setNewTaskData] = useState({
    title: "",
    status: "todo" as "todo" | "in-progress" | "done",
    priority: "medium" as "high" | "medium" | "low",
    tag: "",
  })
  
  // Toast 顯示邏輯
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showToast])
  
  const showToastMessage = (message: string, type: "success" | "info" = "info") => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
  }
  
  // 添加留言功能
  const handleAddComment = (taskId: string, commentText: string) => {
    if (!commentText.trim()) return
    
    const newComment: Comment = {
      id: Date.now().toString(),
      user: { name: "John Doe" },
      text: commentText,
      timestamp: new Date(),
    }
    
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, comments: [...(task.comments || []), newComment] }
        : task
    ))
    
    // 更新 selectedTask 以反映新留言
    const updatedTask = tasks.find(t => t.id === taskId)
    if (updatedTask) {
      setSelectedTask({ ...updatedTask, comments: [...(updatedTask.comments || []), newComment] })
    }
    
    setCommentText("")
  }
  
  // 儲存設定功能
  const handleSaveSettings = async () => {
    setIsSavingSettings(true)
    
    // 模擬 API 呼叫延遲
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSavingSettings(false)
    showToastMessage("Settings saved successfully!", "success")
  }
  
  // 格式化時間戳記
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return "just now"
    if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
    if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
    if (days < 7) return `${days} ${days === 1 ? 'day' : 'days'} ago`
    return timestamp.toLocaleDateString("zh-TW", { year: "numeric", month: "short", day: "numeric" })
  }
  
  // 開啟 New Task Modal 函數（接受選填的 initialStatus）
  const openNewTaskModal = (initialStatus: "todo" | "in-progress" | "done" = "todo") => {
    setNewTaskData({
      title: "",
      status: initialStatus,
      priority: "medium",
      tag: "",
    })
    setIsNewTaskModalOpen(true)
  }
  
  // 創建新任務
  const handleCreateTask = () => {
    if (!newTaskData.title.trim()) {
      showToastMessage("Please enter a task title")
      return
    }
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskData.title,
      status: newTaskData.status,
      priority: newTaskData.priority,
      tag: {
        label: newTaskData.tag || "General",
        color: getTagColor(newTaskData.tag || "General"),
      },
      assignee: { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32" },
      description: "",
    }
    
    setTasks([...tasks, newTask])
    setIsNewTaskModalOpen(false)
    setNewTaskData({ title: "", status: "todo", priority: "medium", tag: "" })
    showToastMessage("Task created successfully!")
  }
  
  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        activeDropdown === "filter" &&
        filterDropdownRef.current &&
        filterButtonRef.current &&
        !filterDropdownRef.current.contains(event.target as Node) &&
        !filterButtonRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null)
      }
      if (
        activeDropdown === "sort" &&
        sortDropdownRef.current &&
        sortButtonRef.current &&
        !sortDropdownRef.current.contains(event.target as Node) &&
        !sortButtonRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null)
      }
    }

    if (activeDropdown) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [activeDropdown])

  // My Tasks 狀態 (僅顯示指派給我的任務)
  const myTasks = useMemo(() => 
    tasks.filter(task => task.assignee.name === "Sarah Chen" || task.assignee.name === "Mike Ross" || task.assignee.name === "Alex Kim"),
    [tasks]
  )
  
  // 將任務分組到欄位，並應用過濾（使用 useMemo 優化性能）
  const columns: Column[] = useMemo(() => {
    // 過濾任務函數
    const filterTasks = (taskList: Task[]) => {
      let filtered = taskList

      // 搜尋過濾
      if (searchQuery.trim()) {
        filtered = filtered.filter(task =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      // High Priority 過濾
      if (filterOptions.highPriority) {
        filtered = filtered.filter(task => task.priority === "high")
      }

      // My Tasks Only 過濾（如果需要，可以在這裡添加）

      // Due This Week 過濾（如果需要，可以在這裡添加）

      return filtered
    }

    return [
      {
        id: "todo",
        title: "To Do",
        tasks: filterTasks(tasks.filter(task => task.status === "todo")),
      },
      {
        id: "in-progress",
        title: "In Progress",
        tasks: filterTasks(tasks.filter(task => task.status === "in-progress")),
      },
      {
        id: "done",
        title: "Done",
        tasks: filterTasks(tasks.filter(task => task.status === "done")),
      },
    ]
  }, [tasks, filterOptions.highPriority, filterOptions.myTasksOnly, filterOptions.dueThisWeek, searchQuery])

  const teamMembers = [
    { name: "Sarah Chen", avatar: "/placeholder.svg?height=32&width=32" },
    { name: "Alex Kim", avatar: "/placeholder.svg?height=32&width=32" },
    { name: "Mike Ross", avatar: "/placeholder.svg?height=32&width=32" },
  ]

  // 格式化日期
  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("zh-TW", { year: "numeric", month: "short", day: "numeric" })
  }

  // 任務詳情 Modal (使用 useMemo 避免不必要的重渲染)
  const TaskModal = useMemo(() => {
    if (!selectedTask) return null

  return (
      <AnimatePresence>
        <motion.div
        key="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={() => setSelectedTask(null)}
      >
        <motion.div
          key="modal-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl m-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 關閉按鈕 */}
          <button
            onClick={() => setSelectedTask(null)}
            className="absolute top-4 right-4 z-10 p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>

          <div className="p-8">
            {/* 標題和狀態標籤 */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-3xl font-bold text-gray-900 pr-8">{selectedTask.title}</h2>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center rounded-md ${selectedTask.tag.color} px-3 py-1.5 text-sm font-medium text-white`}
                >
                  {selectedTask.tag.label}
                </span>
                {selectedTask.priority === "high" ? (
                  <span className="inline-flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    High Priority
                  </span>
                ) : selectedTask.priority === "medium" ? (
                  <span className="inline-flex items-center gap-1 text-sm text-orange-600">
                    <TrendingUp className="h-4 w-4" />
                    Medium Priority
                  </span>
                ) : null}
            </div>
          </div>

            {/* 指派人員 */}
            <div className="mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedTask.assignee.avatar || "/placeholder.svg"} alt={selectedTask.assignee.name} />
                  <AvatarFallback>
                    {selectedTask.assignee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-gray-900">Assigned to</p>
                  <p className="text-sm text-gray-600">{selectedTask.assignee.name}</p>
                </div>
              </div>
            </div>

            {/* 詳細描述 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{selectedTask.description}</p>
            </div>

            {/* 留言區 */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comments {selectedTask.comments && selectedTask.comments.length > 0 && `(${selectedTask.comments.length})`}
              </h3>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {selectedTask.comments && selectedTask.comments.length > 0 ? (
                  [...selectedTask.comments]
                            .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
                            .map((comment) => {
                              const formatTimestamp = (timestamp: Date) => {
                                const now = new Date()
                                const diff = now.getTime() - timestamp.getTime()
                                const minutes = Math.floor(diff / 60000)
                                const hours = Math.floor(diff / 3600000)
                                const days = Math.floor(diff / 86400000)
                                
                                if (minutes < 1) return "just now"
                                if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
                                if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
                                if (days < 7) return `${days} ${days === 1 ? 'day' : 'days'} ago`
                                return timestamp.toLocaleDateString("zh-TW", { year: "numeric", month: "short", day: "numeric" })
                              }
                              
                              return (
                                <div key={comment.id} className="flex gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="text-xs">
                                      {comment.user.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                      <p className="text-sm font-medium text-gray-900 mb-1">{comment.user.name}</p>
                                      <p className="text-sm text-gray-600">{comment.text}</p>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1 ml-1">{formatTimestamp(comment.timestamp)}</p>
                                  </div>
                                </div>
                              )
                            })
                ) : (
                  <p className="text-sm text-gray-400 italic">No comments yet. Be the first to comment!</p>
                )}
              </div>
              {/* 輸入框 */}
              <div className="mt-4 flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">JD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <textarea
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full px-4 py-2 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={2}
                  />
                  <div className="mt-2 flex justify-end">
                    <Button 
                      size="sm"
                      onClick={() => {
                        if (selectedTask) {
                          const newComment: Comment = {
                            id: Date.now().toString(),
                            user: { name: "John Doe" },
                            text: commentText,
                            timestamp: new Date(),
                          }
                          
                          setTasks(tasks.map(task => 
                            task.id === selectedTask.id 
                              ? { ...task, comments: [...(task.comments || []), newComment] }
                              : task
                          ))
                          
                          setSelectedTask({ ...selectedTask, comments: [...(selectedTask.comments || []), newComment] })
                          setCommentText("")
                        }
                      }}
                      disabled={!commentText.trim()}
                    >
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
      </AnimatePresence>
    )
  }, [selectedTask, commentText, handleAddComment, formatTimestamp])

  // New Project Modal (使用 useMemo 避免不必要的重渲染)
  const NewProjectModal = useMemo(() => {
    if (!isNewProjectModalOpen) return null

    return (
      <AnimatePresence>
        <motion.div
        key="new-project-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={() => setIsNewProjectModalOpen(false)}
      >
        <motion.div
          key="new-project-modal-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-md bg-white rounded-lg shadow-xl m-4"
          onClick={(e) => e.stopPropagation()}
        >
            {/* 關閉按鈕 */}
            <button
              onClick={() => setIsNewProjectModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>

            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Project</h2>

              {/* Project Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProjectData.name}
                  onChange={(e) => setNewProjectData({ ...newProjectData, name: e.target.value })}
                  placeholder="Enter project name"
                  className="w-full px-4 py-2 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Template */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template
                </label>
                <select
                  value={newProjectData.template}
                  onChange={(e) => setNewProjectData({ ...newProjectData, template: e.target.value })}
                  className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Blank">Blank</option>
                  <option value="Kanban Board">Kanban Board</option>
                  <option value="Task List">Task List</option>
                  <option value="Calendar View">Calendar View</option>
                  <option value="Timeline">Timeline</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsNewProjectModalOpen(false)
                    setNewProjectData({ name: "", template: "Blank" })
                  }}
                >
                  Cancel
            </Button>
                <Button
                  onClick={() => {
                    // 這裡可以添加創建項目的邏輯
                    setIsNewProjectModalOpen(false)
                    setNewProjectData({ name: "", template: "Blank" })
                  }}
                >
                  Create
            </Button>
          </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }, [isNewProjectModalOpen, newProjectData])

  // New Task Modal (使用 useMemo 避免不必要的重渲染)
  const NewTaskModal = useMemo(() => {
    if (!isNewTaskModalOpen) return null

    return (
      <AnimatePresence>
        <motion.div
          key="new-task-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setIsNewTaskModalOpen(false)}
        >
          <motion.div
            key="new-task-modal-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-md bg-white rounded-lg shadow-xl m-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 關閉按鈕 */}
            <button
              onClick={() => setIsNewTaskModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>

            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Task</h2>

              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTaskData.title}
                  onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
                  placeholder="Enter task title"
                  className="w-full px-4 py-2 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Status */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={newTaskData.status}
                  onChange={(e) => setNewTaskData({ ...newTaskData, status: e.target.value as "todo" | "in-progress" | "done" })}
                  className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              {/* Priority */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={newTaskData.priority}
                  onChange={(e) => setNewTaskData({ ...newTaskData, priority: e.target.value as "high" | "medium" | "low" })}
                  className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Tag */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tag
                </label>
                <input
                  type="text"
                  value={newTaskData.tag}
                  onChange={(e) => setNewTaskData({ ...newTaskData, tag: e.target.value })}
                  placeholder="e.g. Design, Dev, Research"
                  className="w-full px-4 py-2 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsNewTaskModalOpen(false)
                    setNewTaskData({ title: "", status: "todo", priority: "medium", tag: "" })
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateTask}>
                  Create Task
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }, [isNewTaskModalOpen, newTaskData, handleCreateTask])

  // Toast 組件 (使用 useMemo 避免不必要的重渲染)
  const Toast = useMemo(() => {
    if (!showToast) return null

    const isSuccess = toastType === "success"
    
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-4 right-4 z-[100] px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
            isSuccess 
              ? "bg-green-600 text-white" 
              : "bg-gray-900 text-white"
          }`}
        >
          {isSuccess && <CheckCircle className="h-5 w-5" />}
          <span>{toastMessage}</span>
          <button
            onClick={() => setShowToast(false)}
            className={`ml-2 ${isSuccess ? "hover:text-green-200" : "hover:text-gray-300"}`}
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      </AnimatePresence>
    )
  }, [showToast, toastMessage, toastType])

  // 渲染內容區域
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
        <main className="flex-1 overflow-x-auto overflow-y-auto bg-gray-50 p-6">
          <div className="flex gap-6 h-full">
            {columns.map((column) => (
              <div key={column.id} className="flex min-w-[320px] flex-col">
                {/* Column Header */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-gray-900">{column.title}</h2>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-600">
                      {column.tasks.length}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => openNewTaskModal(column.id as "todo" | "in-progress" | "done")}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Tasks */}
                <div className="space-y-3 flex-1">
                  {column.tasks.map((task) => (
                    <Card
                      key={task.id}
                      className="group cursor-pointer border border-gray-200 bg-white p-4 transition-all hover:border-blue-600 hover:shadow-sm"
                        onClick={() => setSelectedTask(task)}
                    >
                      <div className="space-y-3">
                        {/* Tag */}
                        <div className="flex items-start justify-between">
                          <span
                            className={`inline-flex items-center rounded-md ${task.tag.color} px-2 py-1 text-xs font-medium text-white`}
                          >
                            {task.tag.label}
                          </span>
                          {task.priority === "high" ? (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          ) : task.priority === "medium" ? (
                            <TrendingUp className="h-4 w-4 text-orange-500" />
                          ) : null}
                        </div>

                        {/* Title */}
                        <h3 className="text-sm font-medium leading-snug text-gray-900">{task.title}</h3>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
                            <AvatarFallback className="text-xs">
                              {task.assignee.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
        )

      case "my-tasks":
        return (
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">My Tasks</h2>
                <p className="text-gray-600">Tasks assigned to you</p>
              </div>
              
              <div className="space-y-3">
                {myTasks.map((task) => (
                  <Card
                    key={task.id}
                    className="border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedTask(task)}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
                          <span
                            className={`inline-flex items-center rounded-md ${task.tag.color} px-2 py-1 text-xs font-medium text-white ml-2`}
                          >
                            {task.tag.label}
                          </span>
                        </div>
                        {task.dueDate && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>Due: {formatDate(task.dueDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        )

      case "settings":
        return (
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Settings</h2>
                <p className="text-gray-600">Manage your account settings and preferences</p>
              </div>

              <Card className="p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile</h3>
                
                {/* Avatar */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="text-xl">JD</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">Change Avatar</Button>
                  </div>
                </div>

                {/* Name */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Name
                  </label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                    className="w-full px-4 py-2 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Email */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full px-4 py-2 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveSettings}
                    disabled={isSavingSettings}
                  >
                    {isSavingSettings ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </h3>
                
                <div className="space-y-1">
                  <Toggle
                    checked={settings.notifications.email}
                    onChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, email: checked },
                      })
                    }
                    label="Email Notifications"
                  />
                  <Toggle
                    checked={settings.notifications.push}
                    onChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, push: checked },
                      })
                    }
                    label="Push Notifications"
                  />
                  <Toggle
                    checked={settings.notifications.taskUpdates}
                    onChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, taskUpdates: checked },
                      })
                    }
                    label="Task Updates"
                  />
                </div>
              </Card>
            </div>
          </main>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200 bg-white transition-transform duration-300 lg:translate-x-0 lg:static`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <CheckSquare className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">TaskFlow</span>
            </div>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 ${
                activeTab === "dashboard" ? "bg-gray-100 text-gray-900" : "text-gray-700"
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 ${
                activeTab === "my-tasks" ? "bg-gray-100 text-gray-900" : "text-gray-700"
              }`}
              onClick={() => setActiveTab("my-tasks")}
            >
              <CheckSquare className="h-5 w-5" />
              My Tasks
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 ${
                activeTab === "settings" ? "bg-gray-100 text-gray-900" : "text-gray-700"
              }`}
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="h-5 w-5" />
              Settings
            </Button>
          </nav>

          {/* New Project Button */}
          <div className="border-t border-gray-200 p-4">
            <Button
              className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
              onClick={() => setIsNewProjectModalOpen(true)}
            >
              <Plus className="h-5 w-5" />
              New Project
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
          <div className="flex items-center gap-4 flex-1">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">
              {activeTab === "dashboard" ? "Product Design Sprint" : activeTab === "my-tasks" ? "My Tasks" : "Settings"}
            </h1>
            
            {/* Search Bar */}
            {activeTab === "dashboard" && (
              <div className="relative max-w-xs flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            )}
          </div>

          {activeTab === "dashboard" && (
          <div className="flex items-center gap-3">
            {/* Team Avatars */}
            <div className="flex -space-x-2">
              {teamMembers.map((member, index) => (
                <Avatar key={index} className="h-8 w-8 border-2 border-white">
                  <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                  <AvatarFallback>
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>

              {/* Notification Button */}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setHasNotifications(!hasNotifications)}
              >
                <Bell className="h-5 w-5" />
                {hasNotifications && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
            </Button>

              {/* Help Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => showToastMessage("Documentation is coming soon!")}
              >
                <HelpCircle className="h-5 w-5" />
            </Button>

              {/* New Task Button */}
              <Button
                className="gap-2 bg-blue-600 hover:bg-blue-700"
                onClick={() => openNewTaskModal("todo")}
              >
                    <Plus className="h-4 w-4" />
                New Task
                  </Button>

              {/* Action Buttons */}
              <div className="relative">
                <Button
                  ref={filterButtonRef}
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-transparent"
                  onClick={() => setActiveDropdown(activeDropdown === "filter" ? null : "filter")}
                >
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                {activeDropdown === "filter" && (
                  <div
                    ref={filterDropdownRef}
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                  >
                    <div className="p-3 space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded px-2 py-1.5">
                        <input
                          type="checkbox"
                          checked={filterOptions.myTasksOnly}
                          onChange={(e) =>
                            setFilterOptions({ ...filterOptions, myTasksOnly: e.target.checked })
                          }
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">My Tasks Only</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded px-2 py-1.5">
                        <input
                          type="checkbox"
                          checked={filterOptions.highPriority}
                          onChange={(e) =>
                            setFilterOptions({ ...filterOptions, highPriority: e.target.checked })
                          }
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">High Priority</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded px-2 py-1.5">
                        <input
                          type="checkbox"
                          checked={filterOptions.dueThisWeek}
                          onChange={(e) =>
                            setFilterOptions({ ...filterOptions, dueThisWeek: e.target.checked })
                          }
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Due This Week</span>
                      </label>
                        </div>
                        </div>
                )}
                      </div>
              <div className="relative">
                <Button
                  ref={sortButtonRef}
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-transparent"
                  onClick={() => setActiveDropdown(activeDropdown === "sort" ? null : "sort")}
                >
                  <ArrowUpDown className="h-4 w-4" />
                  Sort
                </Button>
                {activeDropdown === "sort" && (
                  <div
                    ref={sortDropdownRef}
                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                  >
                    <div className="p-1">
                      {["Date Created", "Priority", "Alphabetical"].map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setSortOption(option)
                            setActiveDropdown(null)
                          }}
                          className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 transition-colors ${
                            sortOption === option ? "bg-gray-100 text-blue-600 font-medium" : "text-gray-700"
                          }`}
                        >
                          {option}
                        </button>
                  ))}
                </div>
              </div>
                )}
          </div>
            </div>
          )}
        </header>

        {/* Content Area */}
        {renderContent()}
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Task Modal */}
      {TaskModal}

      {/* New Project Modal */}
      {NewProjectModal}

      {/* New Task Modal */}
      {NewTaskModal}

      {/* Toast */}
      {Toast}
    </div>
  )
}
