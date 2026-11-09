CREATE TABLE `admins` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`password_hash` text NOT NULL,
	`failed_attempts` integer DEFAULT 0 NOT NULL,
	`locked_until` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admins_email_unique` ON `admins` (`email`);--> statement-breakpoint
CREATE TABLE `login_attempts` (
	`ip` text PRIMARY KEY NOT NULL,
	`failures` integer DEFAULT 0 NOT NULL,
	`window_start` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `page_content` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`excerpt` text DEFAULT '' NOT NULL,
	`tag` text DEFAULT '資訊' NOT NULL,
	`content_html` text DEFAULT '' NOT NULL,
	`cover_image` text,
	`cover_alt` text DEFAULT '' NOT NULL,
	`cover_fit` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`published_at` integer,
	`seo_title` text,
	`seo_description` text,
	`og_image` text,
	`noindex` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `posts_slug_unique` ON `posts` (`slug`);--> statement-breakpoint
CREATE INDEX `posts_status_published_idx` ON `posts` (`status`,`published_at`);--> statement-breakpoint
CREATE TABLE `product_categories` (
	`slug` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`tile_name` text NOT NULL,
	`nav_name` text NOT NULL,
	`footer_name` text NOT NULL,
	`intro_html` text DEFAULT '' NOT NULL,
	`card_image` text,
	`keywords` text DEFAULT '' NOT NULL,
	`contact_eyebrow` text DEFAULT '' NOT NULL,
	`contact_heading` text DEFAULT '' NOT NULL,
	`show_on_home` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`seo_title` text,
	`seo_description` text,
	`og_image` text,
	`noindex` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`category_slug` text NOT NULL,
	`name` text NOT NULL,
	`image` text,
	`image_alt` text DEFAULT '' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`category_slug`) REFERENCES `product_categories`(`slug`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `products_category_idx` ON `products` (`category_slug`,`sort_order`);--> statement-breakpoint
CREATE TABLE `redirects` (
	`from_path` text PRIMARY KEY NOT NULL,
	`to_path` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`admin_id` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `sessions_admin_idx` ON `sessions` (`admin_id`);--> statement-breakpoint
CREATE TABLE `showcase_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`image` text NOT NULL,
	`category_slug` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`category_slug`) REFERENCES `product_categories`(`slug`) ON UPDATE cascade ON DELETE cascade
);
