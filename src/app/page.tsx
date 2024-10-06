'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { logout } from '@/app/libs/auth';
import { Layout, Dropdown, Menu, Input, Button, Form } from 'antd';
import { Table } from 'antd';
import type { TableColumnsType} from 'antd';
import axios from 'axios';

interface University {
  alpha_two_code: string;
  country: string;
  state_province: string | null;
  domains: string[];
  name: string;
  web_pages: string[];
}

interface UniversityData {
  key: React.Key;
  name: string;
  country: string;
  state_province: string | null;
  alpha_two_code: string;
  domains: string[];
  web_pages: string[];
}

const columns: TableColumnsType<UniversityData> = [
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
    sortDirections: ['ascend', 'descend'],
  },
  {
    title: 'Country',
    dataIndex: 'country',
    sorter: (a, b) => a.country.localeCompare(b.country),
  },
  {
    title: 'Province',
    dataIndex: 'state_province',
    sorter: (a, b) => (a.state_province || '').localeCompare(b.state_province || ''),
  },
  {
    title: 'Code Alpha',
    dataIndex: 'alpha_two_code',
    sorter: (a, b) => a.alpha_two_code.localeCompare(b.alpha_two_code),
  },
  {
    title: 'Domain',
    dataIndex: 'domains',
    render: (domains: string[]) => domains.join(', '), // Joining domains for display
  },
  {
    title: 'Web Page',
    dataIndex: 'web_pages',
    render: (web_pages: string[]) => (
      <a href={web_pages[0]} target="_blank" rel="noopener noreferrer">
        Visit
      </a>
    ),
  },
];

const { Header } = Layout;

export default function DashboardPage() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [countryText, setCountryText] = useState('');
  const [universities, setUniversities] = useState<UniversityData[]>([]);

  const handleLogout = () => {
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"; // Remove token from cookies
    logout();
    router.push('/login');
  };

  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('authToken='));
    if (!token) {
      router.push('/login'); // Redirect to login if no token
    }
  }, [router]);

  const menu = (
    <Menu>
      <Menu.Item disabled>
        Hai, User
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const handleSearch = async () => {
    if (searchText && countryText) {
      try {
        const response = await axios.get(`http://universities.hipolabs.com/search`, {
          params: { name: searchText, country: countryText },
        });
        const data: University[] = response.data;
        
        const formattedData: UniversityData[] = data.map((uni, index) => ({
          key: index, // Using index as key (you might want to change this based on your unique identifiers)
          name: uni.name,
          country: uni.country,
          state_province: uni.state_province,
          alpha_two_code: uni.alpha_two_code,
          domains: uni.domains,
          web_pages: uni.web_pages,
        }));
        
        setUniversities(formattedData);
      } catch (error) {
        console.error('Error fetching universities:', error);
        setUniversities([]); // Clear data on error
      }
    } else {
      setUniversities([]); // Clear the data if search or country is empty
    }
  };

  return (
    <div>
      <Layout>
        <Header className="bg-blue-500 shadow-md fixed top-0 left-0 right-0 z-10 items-center px-4 w-full">
          <div className="flex items-center justify-between">
            <div className="logo" style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
              Dashboard
            </div>
            <Dropdown overlay={menu} trigger={['click']}>
              <img
                src="/avatar.png"
                alt="User Avatar"
                className="rounded-full w-10 h-10 mx-1 cursor-pointer hover:opacity-80"
              />
            </Dropdown>
          </div>
        </Header>
      </Layout>

      <div className="flex flex-col mt-[100px] items-center">
        <Form
          layout="inline"
          onFinish={handleSearch}
          className="w-[1000px] mb-4 flex justify-end"
        >
          <Form.Item>
            <Input
              placeholder="Search by name"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-[200px]"
            />
          </Form.Item>
          <Form.Item>
            <Input
              placeholder="Search by country"
              value={countryText}
              onChange={(e) => setCountryText(e.target.value)}
              className="w-[200px]"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className='mr-[-15px] w-[100px]'>
              Search
            </Button>
          </Form.Item>
        </Form>
        
        <Table<UniversityData>
          columns={columns}
          dataSource={universities}
          className="w-[1000px] bg-white rounded-lg"
          pagination={{ pageSize: 5 }}
        />
      </div>
    </div>
  );
}