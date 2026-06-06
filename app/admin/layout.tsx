import {HeaderOwner} from "@/components/header/header-owner";
import {AdminSidebar} from "@/components/admin-sidebar/admin-sidebar";
import React from "react";
import "./admin-layout.css";

export default function ({children}: { children: React.ReactNode }) {
    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-layout__main">
                <HeaderOwner />
                <main className="admin-layout__content">
                    {children}
                </main>
            </div>
        </div>
    )
}
