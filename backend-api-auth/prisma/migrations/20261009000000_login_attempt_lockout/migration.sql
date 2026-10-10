ALTER TABLE "auth"."User"
ADD COLUMN "failed_login_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "locked_until" TIMESTAMP(3),
ADD COLUMN "last_login_at" TIMESTAMP(3);

CREATE TABLE "auth"."LoginAttempt" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "email_hash" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "attempted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginAttempt_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "LoginAttempt_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "auth"."LoginLockout" (
    "email_hash" TEXT NOT NULL,
    "failed_login_count" INTEGER NOT NULL DEFAULT 0,
    "locked_until" TIMESTAMP(3),

    CONSTRAINT "LoginLockout_pkey" PRIMARY KEY ("email_hash")
);

CREATE INDEX "LoginAttempt_user_id_attempted_at_idx" ON "auth"."LoginAttempt"("user_id", "attempted_at");
CREATE INDEX "LoginAttempt_email_hash_attempted_at_idx" ON "auth"."LoginAttempt"("email_hash", "attempted_at");
