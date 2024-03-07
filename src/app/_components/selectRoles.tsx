"use client";

import { useState } from "react";
import { type Role } from "~/models/types";

export function SelectRoles({ roles }: { roles: Role[] }) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const toggleRole = (roleId: string) => {
    const index = selectedRoles.indexOf(roleId);
    if (index === -1) {
      setSelectedRoles([...selectedRoles, roleId]);
    } else {
      const updatedRoles = [...selectedRoles];
      updatedRoles.splice(index, 1);
      setSelectedRoles(updatedRoles);
    }
  };

  const handleRoleSelection = (roleId: string) => {
    toggleRole(roleId);
    console.log("Selected Roles:", selectedRoles);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-4 text-2xl font-bold">Select Roles</h1>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <li
            key={role.id}
            className="cursor-pointer rounded-lg border p-4 hover:bg-gray-100 hover:bg-opacity-25"
            onClick={() => handleRoleSelection(role.id)}
          >
            <input
              type="checkbox"
              className="mr-2 cursor-pointer"
              checked={selectedRoles.includes(role.id)}
              onChange={() => handleRoleSelection(role.id)}
            />
            <label>{role.role}</label>
          </li>
        ))}
      </ul>
    </div>
  );
}
