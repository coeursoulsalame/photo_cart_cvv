import { useState } from 'react';
import axios from 'axios';
import { User } from '../types/types';

interface UseUserSearchResult {
    users: User[];
    loading: boolean;
    searchUsers: (searchText: string) => Promise<void>;
}

export const useUserSearch = (): UseUserSearchResult => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    const searchUsers = async (searchText: string) => {
        if (!searchText.trim()) {
            setUsers([]);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`http://10.16.0.39:5000/api/users/get-by-name?name=${searchText}`);
            
            const userData = response.data;
            
            const formattedUsers = userData.map((user: any) => ({
                id: parseInt(user.id, 10),
                name: `${user.lastName} ${user.name} ${user.secondName}`.trim(),
                department: user.workDepartment,
                email: user.email,
                login: user.login
            })).filter((user: any) => user.id);
            console.log('Formatted users:', formattedUsers);
            setUsers(formattedUsers);
        } catch (error) {
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    return { users, loading, searchUsers };
};