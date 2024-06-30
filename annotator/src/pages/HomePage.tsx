import DatabaseHooks from "../hooks/data/database";
import { FC } from "react";
import React from "react";

interface HomePageProps {}

const HomePage: FC<HomePageProps> = () => {
  const projects = DatabaseHooks.useTableSelectAll("projects") as Project[] | null;

  return (
    <div>
      <div className='flex flex-wrap'>
        {projects && projects.length > 0 && projects.map((project: any) => <ProjectCard key={project.project_id} project={project} />)}
      </div>
      <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4' onClick={() => (window.location.href = "#/create/project")}>
        Create Project
      </button>
    </div>
  );
};

export default HomePage;
