using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Altairis.Api.Migrations
{
    public partial class AddNeedsCleaning : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "NeedsCleaning",
                table: "Inventories",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NeedsCleaning",
                table: "Inventories");
        }
    }
}
