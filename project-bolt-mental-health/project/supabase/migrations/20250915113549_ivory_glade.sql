/*
  # Fix recommendations table RLS policy

  1. Security Changes
    - Add INSERT policy for recommendations table to allow system-generated recommendations
    - Update existing policies to ensure proper access control
    
  2. Changes Made
    - Add policy for authenticated users to insert recommendations
    - Ensure users can view and update their own recommendations
*/

-- Add INSERT policy for recommendations table
CREATE POLICY "System can insert recommendations for users"
  ON recommendations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Ensure the existing SELECT policy is correct
DROP POLICY IF EXISTS "Users can view own recommendations" ON recommendations;
CREATE POLICY "Users can view own recommendations"
  ON recommendations
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Ensure the existing UPDATE policy is correct
DROP POLICY IF EXISTS "Users can update own recommendations" ON recommendations;
CREATE POLICY "Users can update own recommendations"
  ON recommendations
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());