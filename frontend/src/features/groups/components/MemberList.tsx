/**
 * Componente para mostrar lista de miembros (Coaches o Athletes)
 * 
 * Presenta los miembros de un grupo de forma ordenada
 */

import React from 'react';
import type { MemberDetail } from '../types';
import { formatMemberDisplay } from '../utils';

interface MemberListProps {
  title: string;
  icon: string;
  badge: string;
  members: (string | MemberDetail)[];
  memberDetails: Record<string, MemberDetail>;
  memberCount: number;
  onAddMember: () => void;
  onRemoveMember: (memberId: string) => void;
  isLoading?: boolean;
  rowClassName?: string;
}

const MESSAGES = {
  NO_MEMBERS: 'Sin miembros asignados',
  BUTTON_ADD: 'Agregar',
  REMOVE_TOOLTIP: 'Remover',
};

export const MemberList: React.FC<MemberListProps> = ({
  title,
  icon,
  badge,
  members,
  memberDetails,
  memberCount,
  onAddMember,
  onRemoveMember,
  isLoading = false,
  rowClassName = 'col-md-6',
}) => {
  return (
    <div className={rowClassName}>
      <div className="section-box">
        <h5 className="d-flex justify-content-between">
          <div>
            <i className={`fa ${icon}`}></i> {title}
            <span className={`badge ${badge} ml-2`}>
              {memberCount}
            </span>
          </div>
          <button
            className="btn btn-success btn-xs"
            onClick={onAddMember}
            title={`${MESSAGES.BUTTON_ADD} ${title.toLowerCase()}`}
            disabled={isLoading}
          >
            <i className="fa fa-plus"></i> {MESSAGES.BUTTON_ADD} {title}
          </button>
        </h5>

        <div className="members-list">
          {memberCount === 0 ? (
            <p className="text-muted">
              <em>{MESSAGES.NO_MEMBERS}</em>
            </p>
          ) : (
            <ul className="list-group mb-0">
              {members.map((member) => {
                const memberId =
                  typeof member === 'string' ? member : (member as any)._id;
                const memberDetail = memberDetails[memberId];

                if (!memberDetail) {
                  return null;
                }

                return (
                  <li
                    key={memberId}
                    className="list-group-item"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      borderRadius: '3px',
                      marginBottom: '5px',
                      backgroundColor: '#f9f9f9',
                      border: '1px solid #ddd',
                    }}
                  >
                    <span>
                      <strong>{formatMemberDisplay(memberDetail)}</strong>
                    </span>
                    <button
                      className="btn btn-danger btn-xs"
                      onClick={() => onRemoveMember(memberId)}
                      title={MESSAGES.REMOVE_TOOLTIP}
                      disabled={isLoading}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
