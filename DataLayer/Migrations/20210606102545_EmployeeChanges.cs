using Microsoft.EntityFrameworkCore.Migrations;

namespace DataLayer.Migrations
{
    public partial class EmployeeChanges : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Address",
                table: "Employees",
                newName: "Street");

            migrationBuilder.AddColumn<string>(
                name: "District",
                table: "Employees",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HouseNo",
                table: "Employees",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageName",
                table: "Employees",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Province",
                table: "Employees",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "District",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "HouseNo",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "ImageName",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "Province",
                table: "Employees");

            migrationBuilder.RenameColumn(
                name: "Street",
                table: "Employees",
                newName: "Address");
        }
    }
}
