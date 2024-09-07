import { SquarePen, BadgeCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';


export default function ProfileCard() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState({});
  

  useEffect(() => {
    const userData = localStorage.getItem("userInfo");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  


  return (
    <div className="card card-compact bg-base-100 shadow-xl w-[40vw] p-5 h-fit">
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <div className="avatar">
            <div className="w-24 rounded-full">
              <Image
                src="/user-avatar.jpg"
                width={150}
                height={150}
                alt="user avatar"
              />
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-xl font-medium">{user?.username}</p>
            {user?.isVerified ? <BadgeCheck /> : ''}
          </div>
        </div>
        <Link href='/profile/edit' className="btn btn-ghost hover:btn-link w-fit text-xs">
          <SquarePen size={15} />
          Edit
        </Link>
      </div>

      <div className="flex flex-col gap-5 mt-7">
        <div className="flex justify-between">
          <p className="text-xl">Email:</p>
          <p className="font-medium text-xl">{user?.email}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-xl">Referal Code:</p>
          <p className="font-medium text-xl">{user?.referralCode ? user?.referralCode : '-'}</p>
        </div>
      </div>
    </div>
  );
}