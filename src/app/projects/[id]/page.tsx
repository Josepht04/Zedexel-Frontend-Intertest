"use client"
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Lens } from "@/components/magicui/lens";
import { Search } from "lucide-react";

const ViewProject = ({ params }: { params: { id: string } }) => {
    interface Project {
        id: string;
        name: string;
        userImgURL: string;
        startDate?: string;
        endDate?: string;
        venue?: string;
        venueCity?: string;
        venueCountry?: string;
        venueHallno?: string;
        venueStandno?: string;
        totalSqmtr?: string;
    }
    
    const [project, setProject] = useState<Project | null>(null);
    const [allProjects, setAllProjects] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);
    const [activeTab, setActiveTab] = useState('Details');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('/db.json');
                const result = await response.json();
                const foundProject = result.projects.find((p: any) => p.id.toString() === params.id);

                setProject(foundProject);
                setAllProjects(result.projects);
            } catch (error) {
                console.error("Error fetching project data:", error);
            }
        };

        fetchProjects();
    }, [params.id]);

    useEffect(() => {
        if (search.trim() === '') {
            setFilteredResults([]);
        } else {
            const results = allProjects.filter(
                (p: any) =>
                    p.name.toLowerCase().includes(search.toLowerCase()) ||
                    p.venue.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredResults(results);
        }
    }, [search, allProjects]);

    if (!project) {
        return <div>Project Not Found</div>;
    }

    // Render the content for each tab
    const renderTabContent = () => {
        switch (activeTab) {
            case 'Details':
                return (
                    <>
                        <div className="flex flex-row gap-20">
                            <Image
                                src={project.userImgURL}
                                alt='User image'
                                width={250}
                                height={250}
                                className="rounded-full"
                            ></Image>
                            <div className="grid grid-cols-4 h-50 w-200 relative top-8"> {/* Creates a 2-column grid */}
                                <div className="text-gray-400">Start Date<div className="text-black">{project.startDate || "NULL"}</div></div>
                                <div className="text-gray-400">End Date<div className="text-black">{project.endDate || "NULL"}</div></div>
                                <div className="text-gray-400">Venue Name<div className="text-black">{project.venue || "NULL"}</div></div>
                                <div className="text-gray-400">Venue City<div className="text-black">{project.venueCity || "NULL"}</div></div>

                                <div className="text-gray-400">Venue country<div className="text-black">{project.venueCountry || "NULL"}</div></div>
                                <div className="text-gray-400">Venue hall number<div className="text-black">{project.venueHallno || "NULL"}</div></div>
                                <div className="text-gray-400">Venue stand number<div className="text-black">{project.venueStandno || "NULL"}</div></div>
                                <div className="text-gray-400">Total sq. mtr<div className="text-black">{project.totalSqmtr || "NULL"}</div></div>
                            </div>
                        </div>

                        <div className='flex flex-col gap-20'>
                            <div className='flex flex-row gap-20'>
                                <div><Lens><Image src='/Images/exhibitionstall28.jpg' alt='stall pic1' width={400} height={400}></Image></Lens></div>
                                <div><Lens><Image src='/Images/exhibitionstall32.jpg' alt='stall pic2' width={400} height={400}></Image></Lens></div>
                                <div><Lens><Image src='/Images/exhibitionstall30.jpeg' alt='' width={400} height={400}></Image></Lens></div>
                            </div>
                            <div className='flex flex-row gap-20'>
                                <div><Lens><Image src='/Images/exhibitionstall29.jpeg' alt='' width={400} height={400}></Image></Lens></div>
                                <div><Lens><Image src='/Images/exhibitionstall31.jpeg' alt='stall pic2' width={400} height={400}></Image></Lens></div>
                                <div><Lens><Image src='/Images/exhibitionstall33.jpeg' alt='stall pic1' width={400} height={400}></Image></Lens></div>
                            </div>
                            <div className='flex flex-row gap-20'>
                                <div><Lens><Image src='/Images/exhibitionstall30.jpeg' alt='' width={400} height={400}></Image></Lens></div>
                                <div><Lens><Image src='/Images/exhibitionstall32.jpg' alt='stall pic2' width={400} height={400}></Image></Lens></div>
                                <div><Lens><Image src='/Images/exhibitionstall28.jpg' alt='stall pic1' width={400} height={400}></Image></Lens></div>
                            </div>
                        </div>
                    </>
                );
            case 'Contractors':
                return (<div>Contractors associated with this project will be displayed here.</div>);
            case 'Quotations':
                return (<div>Project quotations will be displayed here.</div>);
            default:
                return null;
        }
    };

    return (
        <>
            <div className="fixed top-1 h-30 w-full pr-44 z-20 bg-white flex justify-between items-center mb-4">
                <h2 className="font-bold text-2xl font-Oswald">{project.name}</h2>
                <div className="relative">
                    <Search className="absolute left-2 text-gray-500" size={20} style={{ top: '11' }} />
                    <input
                        className="p-2 pl-8 border border-gray-300 rounded-full w-70 focus:outline-none focus:ring focus:ring-blue-900"
                        placeholder="Search by location, user.."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {/* Dropdown for search results */}
                    {filteredResults.length > 0 && (
                        <div className="absolute mt-1 bg-white border border-gray-300 rounded-md shadow-lg w-full max-h-60 overflow-y-auto z-50">
                            {filteredResults.map((result: any) => (
                                <Link href={`/projects/${result.id}`} key={result.id}>
                                    <div className="p-2 hover:bg-gray-200 cursor-pointer">
                                        {result.name} - {result.venue}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="mt-28 flex gap-5 border-b-2 border-gray-200">
                {['Details', 'Contractors', 'Quotations'].map((tab) => (
                    <div
                        key={tab}
                        className={`cursor-pointer pb-2 ${activeTab === tab ? 'text-2xl font-bold text-blue-900 border-b-4 border-blue-900' : 'text-gray-500'}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </div>
                ))}
            </div>

            {/* Tab Content */}
            <div className="mt-4 p-4 bg-white rounded-xl shadow-md">
                {renderTabContent()}
            </div>
        </>
    );
};

export default ViewProject;
