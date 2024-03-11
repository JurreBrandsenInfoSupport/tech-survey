"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { type Session } from "next-auth";
import { type Role } from "~/models/types";

export default function SelectRoles({
  session,
  roles,
}: {
  session: Session;
  roles: Role[];
}) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const setRolesMutation = api.survey.setRole.useMutation();

  const handleRoleToggle = (roleId: string) => {
    const index = selectedRoles.indexOf(roleId);
    let updatedRoles;
    if (index === -1) {
      updatedRoles = [...selectedRoles, roleId];
    } else {
      updatedRoles = [...selectedRoles];
      updatedRoles.splice(index, 1);
    }
    setSelectedRoles(updatedRoles);

    // Trigger mutation whenever a role is toggled
    setRolesMutation.mutate({
      userId: session.user.id,
      roleIds: updatedRoles,
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-4 text-2xl font-bold">Select Roles</h1>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <li
            key={role.id}
            className="cursor-pointer rounded-lg border p-4 hover:bg-gray-100 hover:bg-opacity-25"
            onClick={() => handleRoleToggle(role.id)}
          >
            <input
              type="checkbox"
              className="mr-2 cursor-pointer"
              checked={selectedRoles.includes(role.id)} // Check if role is selected
              onChange={() => handleRoleToggle(role.id)} // Call handleRoleToggle on change
            />
            <label className="cursor-pointer">{role.role}</label>
          </li>
        ))}
      </ul>
    </div>
  );
}
