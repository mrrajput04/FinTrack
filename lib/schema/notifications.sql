-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'danger')),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  related_entity_type TEXT,
  related_entity_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own notifications" ON notifications
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
FOR UPDATE USING (auth.uid() = user_id);

-- Insert some sample notifications
INSERT INTO notifications (user_id, title, message, type, is_read)
SELECT 
  id, 
  'Welcome to FinTrack!', 
  'Thank you for joining FinTrack. Start by adding your accounts and transactions.', 
  'info',
  FALSE
FROM users;

INSERT INTO notifications (user_id, title, message, type, is_read)
SELECT 
  id, 
  'Budget Alert', 
  'You have reached 80% of your Food & Dining budget this month.', 
  'warning',
  FALSE
FROM users;

INSERT INTO notifications (user_id, title, message, type, is_read)
SELECT 
  id, 
  'New Feature Available', 
  'You can now import transactions from CSV files. Try it out!', 
  'success',
  FALSE
FROM users;
