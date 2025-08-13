import { SupabaseClient } from "@supabase/supabase-js";
import { Board, Column, Task } from "./supabase/models";

export const boardService = {
    async getAllBoards(supabase: SupabaseClient, userId: string): Promise<Board[]> {
        const { data, error } = await supabase
            .from("boards")
            .select("*")
            .eq("user_id", userId)

        if (error) {
            throw error;
        }

        return data ?? [];
    },

    async getBoards(supabase: SupabaseClient, userId: string, from: number, to: number): Promise<{ data: Board[]; count: number }> {
        const { data, count, error } = await supabase
            .from("boards")
            .select("*", { count: "exact" })
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .range(from, to);

        if (error) {
            throw error;
        }

        return {
            data: data ?? [],
            count: count ?? 0,
        }
    },

    async createBoard(supabase: SupabaseClient, board: Omit<Board, "id" | "created_at" | "updated_at">): Promise<Board> {
        const { data, error } = await supabase
            .from("boards")
            .insert(board)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data;
    }
}

export const boardDataService = {
    async createBoardWithDefaultColumns(
        supabase: SupabaseClient,
        boardData: {
            title: string;
            description?: string;
            color?: string;
            author?: string;
            userId: string;
        }
    ) {
        const board = await boardService.createBoard(supabase, {
            title: boardData.title,
            description: boardData.description || null,
            color: boardData.color || "bg-[#007AFF]",
            author: boardData.author || null,
            user_id: boardData.userId,
        });

        const defaultColumns = [
            { title: "Backlog", sort_order: 0 },
            { title: "To Do", sort_order: 1 },
            { title: "In Progress", sort_order: 2 },
            { title: "Review", sort_order: 3 },
            { title: "Testing", sort_order: 4 },
            { title: "Blocked", sort_order: 5 },
            { title: "Done", sort_order: 6 },
            { title: "Archived", sort_order: 7 },
        ];

        await Promise.all(
            defaultColumns.map((column) =>
                columnService.createColumn(
                    supabase,
                    {
                        ...column,
                        board_id: board.id,
                        user_id: boardData.userId,
                    }
                ))
        )

        return board;
    }
}

export const columnService = {
    async getColumns(supabase: SupabaseClient, boardId: string): Promise<Column[]> {
        const { data, error } = await supabase
            .from("columns")
            .select("*")
            .eq("board_id", boardId)
            .order("sort_order", { ascending: true });

        if (error) {
            throw error;
        };

        return data ?? [];
    },

    async createColumn(supabase: SupabaseClient, column: Omit<Column, "id" | "created_at">): Promise<Column> {
        const { data, error } = await supabase
            .from("columns")
            .insert(column)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data;
    },
};

export const taskService = {
}