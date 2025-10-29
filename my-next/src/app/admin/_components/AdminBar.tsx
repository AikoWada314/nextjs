"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminBar() {
  const pathname = usePathname() 

  const getLinkClassName = (path: string) => {
    const baseClasses = "pl-5 pr-5 pt-5 pb-5 block transition-colors duration-200 hover:bg-[#a0b4d1]"
    const isActive = pathname.startsWith(path)
    
    return isActive 
      ? `${baseClasses} bg-[#b0c4de] font-medium`
      : `${baseClasses} hover:bg-[#c0d0e0]`
  }

  return (
    <nav className="bg-[#dcdcdc] w-[300px]">
      <div>
        <Link 
          href="/admin/posts" 
          className={getLinkClassName('/admin/posts')}
        >
          記事一覧
        </Link>
      </div>
      <div>
        <Link 
          href="/admin/categories" 
          className={getLinkClassName('/admin/categories')}
        >
          カテゴリー一覧
        </Link>
      </div>
    </nav>
  )
}