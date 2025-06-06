'use client';
import { usePathname,  useRouter, useSearchParams} from 'next/navigation'
import {useEffect, useState} from 'react'
import Image from 'next/image';
import { formUrlQuery, removeKeysFromUrlQuery } from '@jsmastery/utils';

const SearchInput = () => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get('topic') || '';
    const [searchQuery, setSearchQuery] =  useState('');
    
useEffect(() => 
    {
        const delayDebounce = setTimeout(() => {
            if(searchQuery) {
                const newURL = formUrlQuery({
                    params: searchParams.toString(),
                    key: 'topic',
                    value: searchQuery.trim(),
                }

                );

                router.push(newURL, {scroll: false});
            } else{
                if(pathname === '/companions'){
                    const newURL = removeKeysFromUrlQuery({
                        params: searchParams.toString(),
                        keysToRemove: ["topic"],
                    });
                    router.push(newURL, {scroll: false});
                }
                
            }
        }, 500);
    },[searchQuery, router, searchParams, pathname]);

  return (
    <div className='relative border border-black rounded-lg items-center flex gap-2 px-2 py-1 h-fit'>
        <Image src="/icons/search.svg" alt="Search Icon" width={15} height={15} />
        <input
            type="text"
            placeholder="Search by topic"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="outline-none"
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (searchQuery.trim() !== '') {
                        router.push(`${pathname}?topic=${encodeURIComponent(searchQuery.trim())}`);
                    }
                }
            }} />
    </div>
  )
}

export default SearchInput