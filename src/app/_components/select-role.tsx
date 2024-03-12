"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { type Session } from "next-auth";
import { type Role } from "~/models/types";

export default function SelectRoles({
  session,
  roles,
  userSelectedRoles,
}: {
  session: Session;
  roles: Role[];
  userSelectedRoles: Role[];
}) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  useEffect(() => {
    setSelectedRoles(userSelectedRoles.map((role) => role.id));
  }, [userSelectedRoles]);

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
            className={`rounded-lg border p-4 hover:bg-gray-100 hover:bg-opacity-25 ${
              role.default ? "" : "cursor-pointer"
            }`}
            onClick={
              () => !role.default && handleRoleToggle(role.id) // Add a check to prevent toggling for default roles
            }
          >
            <input
              type="checkbox"
              className="accent-custom-primary mr-2 cursor-pointer"
              checked={role.default || selectedRoles.includes(role.id)}
              onChange={() => handleRoleToggle(role.id)}
              disabled={role.default}
            />
            <label
              className={role.default ? "" : "cursor-pointer"}
              style={{ color: role.default ? "#999" : "inherit" }}
            >
              {role.role}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
