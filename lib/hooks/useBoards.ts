'use client';

import { useEffect, useState } from "react";
import { Board } from "../supabase/models";
import { useUser } from "@clerk/nextjs";
import { boardDataService, boardService, taskService } from "../services";
import { useSupabase } from "../supabase/SupabaseProvider";

export function useBoards() {
  const { user } = useUser();
  const { supabase } = useSupabase();
  const [allBoards, setAllBoards] = useState<Board[]>([]);
  const [allLoading, setAllLoading] = useState(true);
  const [allError, setAllError] = useState<string | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadAllBoards();
    }
  }, [user, supabase]);

  async function loadAllBoards() {
    if (!user) {
      return;
    }
    try {
      setAllLoading(true);
      setAllError(null);
      const data = await boardService.getAllBoards(supabase!, user.id);
      setAllBoards(data);
    } catch (err) {
      setAllError(
        err instanceof Error ? err.message : "Failed to load boards."
      );
    } finally {
      setAllLoading(false);
    }
  }

  async function loadBoards(
    from: number,
    to: number,
    setTotalPages: React.Dispatch<React.SetStateAction<number>>,
    pageSize: number
  ) {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const data = await boardService.getBoards(supabase!, user.id, from, to);
      setBoards(data.data);
      setLoading(false);
      setTotalPages(Math.ceil(data.count / pageSize));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load boards.");
    } finally {
      setLoading(false);
    }
  }

  async function createBoard(boardData: {
    title: string;
    description?: string;
    color?: string;
    author?: string;
  }) {
    if (!user) {
      throw new Error("User not authenticated");
    }
    try {
      const newBoard = await boardDataService.createBoardWithDefaultColumns(
        supabase!,
        {
          ...boardData,
          userId: user.id,
        }
      );
      setBoards((prev) => [...prev, newBoard])
    }
    catch (err) {
      setError("Failed to create board.");
    }
  }

  return { loadAllBoards, allLoading, allBoards, allError, boards, loading, error, createBoard, loadBoards }
}
